<?php

namespace System;

use Controllers\ControllerBase;
use DateTime;
use Exception;
use ReflectionMethod;
use ReflectionParameter;
use System\Exceptions\WebException;
use PHPMailer\PHPMailer\PHPMailer;

class App {

    private HttpRequest $http;
    private ControllerBase $controller;

    public function __construct()
    {
        $this->AllowCORS();
        $_ENV = $this->GetEnvironmentVariables();
        $this->http = new HttpRequest();

        set_exception_handler(function($e) {
            $this->HandleException($e);
        });
    }

    /**
     * Process the api request
     *
     * @return void
     */
    public function ProcessRoute(): void
    {
        if (is_null($this->http->controller)) {
            throw new WebException('La petición no es válida.');
        }

        if (is_null($this->http->action)) {
            throw new WebException('La petición no es válida.');
        }

        $fileName = "Controllers/{$this->http->controller}Controller.php";
        if (!file_exists($fileName)) {
            throw new WebException('El controlador ingresado no existe.');
        }

        $file = "Controllers\\{$this->http->controller}Controller";
        $this->controller = new $file($this->http);

        if (!method_exists($this->controller, $this->http->action)) {
            throw new WebException('La acción ingresada no existe.');
        }

        $payload = $this->GetPayload();
        $response = call_user_func_array(array($this->controller, $this->http->action), $payload);
        $response->Print();
    }

    public static function GetEnvironmentVariables(): array
    {
        $root = Utilities::GetRootPath();
        $env = self::ParseEnvironmentVariables(file_get_contents(dirname($root) . "/.env"));

        $customEnv = array();
        if (isset($env['environment']) && file_exists(dirname(__DIR__) . "/Environments/.{$env['environment']}.env")) {
            $customEnv = self::ParseEnvironmentVariables(file_get_contents(dirname(__DIR__) . "/Environments/.{$env['environment']}.env"));
        }

        return array_merge($env, $customEnv);
    }
    
    /**
     * Iterate over the request action parameters and parse the input
     *
     * @return array A collection of parameters
     */
    private function GetPayload(): array
    {
        $response = array();
        $method = new ReflectionMethod($this->controller, $this->http->action);

        foreach ($method->getParameters() as $param) {
            $idx = array_search($param->name, array_keys($this->http->payload));
            $refParam = new ReflectionParameter(array($this->controller, $this->http->action), $param->name);
            $isOptional = $refParam->isOptional();
            if ($idx === FALSE) {
                if (!$isOptional) {
                    throw new WebException("El parámetro {$param->name} es obligatorio.");
                }
                $response[$param->name] = $refParam->getDefaultValue();
            } else {
                $val = $this->http->payload[$param->name];
                if (gettype($val) && $val == FALSE) {
                    
                }
                if (!$this->TryParseProp($refParam->getType()->getName(), $val)) {
                    throw new WebException("El parámetro {$param->name} no es válido.");
                }
                $response[$param->name] = $val;
            }
        }

        return $response;
    }

    private function TryParseProp(string $type, string &$value): bool
    {
        switch($type) {
            case "string":
                $value = trim($value);
                return TRUE;

            case "int":
                if (!is_numeric($value)) {
                    return FALSE;
                }
                $value = intval($value);
                return TRUE;

            case "DateTime":
                $aux = FALSE;
                if (is_numeric($value)) {
                    $aux = DateTime::createFromFormat('U', $value);
                } else {
                    $aux = DateTime::createFromFormat("Y-m-d H:i:s", urldecode($value));
                }
                if ($aux === FALSE) {
                    return FALSE;
                }
                $value = $aux;
                return TRUE;

            case "bool":
                if (is_bool($value)) {
                    return TRUE;
                } else if (is_numeric($value)) {
                    if ($value != 0 && $value != 1)
                        return FALSE;
                } else {
                    if (strcasecmp($value, "true") !== 0 && strcasecmp($value, "false"))
                        return FALSE;
                }

                $value = $value == 1 || strcasecmp($value, "true") === 0 ? TRUE : FALSE;
                return TRUE;

            default:
                return FALSE;
        }
    }

    private static function ParseEnvironmentVariables(string $input): array
    {
        $result = array();
        foreach (explode("\r\n", $input) as $line)
        {
            if (substr(trim($line), 0, 1) == "#" || strlen(trim($line)) === 0)
            {
                continue;
            }

            if (!preg_match("/^(?'key'[a-zA-Z_]+)=(?'value'.*)/", $line, $matches))
            {
                throw new Exception("Ha ocurrido un error inesperado.");
            }

            $result[$matches['key']] = $matches['value'];
        }
        return $result;
    }

    private function AllowCORS(): void {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Allow: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if($method == "OPTIONS") {
            die();
        }
    }

    private function HandleException($e): void
    {
        $errorMessage = strlen(trim($e->getMessage())) > 0 ?
            trim($e->getMessage()) :
            'Ha ocurrido un error inesperado.';

        if (!($e instanceof WebException)) {
            $idx = $this->TrySaveInDB($e);
            $this->TrySendEmail($e, $idx);
        }

        $response = new HttpResponse($this->http);
        $response->SetBody($errorMessage);
        $response->SetCode(-1);
        $response->Print();
    }

    private function TrySaveInDB(Exception $e): int {
        $id = -1;
        try {
            $db = Database::Init();
            $qry = $db->prepare("INSERT INTO errors VALUES(NULL, :errorMsg, :stackTrace, CURRENT_TIMESTAMP, :ip)");
            $qry->execute([
                "errorMsg" => $e->getMessage(),
                "stackTrace" => $e->getTraceAsString(),
                "ip" => Utilities::GetClientIP()
            ]);

            $id = $db->lastInsertId();
        } catch (Exception $o) {

        } finally {
            return $id;
        }
    }

    private function TrySendEmail(Exception $e, int $idx) {
        try {
            $date = (new DateTime())->format("d/m/y H:i:s");
            $output = "Exception #{$idx} caught at {$date}:" . "<br><hr>";
            $output .= $e->getMessage() . "<br>";
            $output .= $e->getTraceAsString();

            $mail = new PHPMailer();
            $mail->IsSMTP();
            $mail->Host = "smtp.hostinger.com";
            $mail->Port = 465;
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;

            $mail->From = $_ENV['exc_email'];
            $mail->FromName = "hayNoche";

            $mail->Username = $_ENV['exc_email'];
            $mail->Password = $_ENV['exc_password'];

            $mail->Sender = $_ENV['exc_email'];
            $mail->Subject = "[{$date}]: Exception";
            
            $mail->IsHTML(true);
            $mail->Body = $output;
            
            $mail->AddAddress($_ENV['exc_email_to']);

            $mail->Send();
        } catch (Exception $o) {}
    }

}