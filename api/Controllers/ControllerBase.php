<?php

namespace Controllers;

use PDO;
use System\HttpRequest;
use System\HttpResponse;

class ControllerBase {
    
    protected PDO $db;

    private HttpResponse $response;

    public function __construct(HttpRequest $http)
    {
        $this->response = new HttpResponse($http);
        $this->db = $http->db;
    }

    protected function NoContent(?int $code = 204): HttpResponse
    {
        return $this->Response('HTTP/1.1 204 No Content', $code);
    }

    protected function BadRequest(string $body = NULL, ?int $code = 400): HttpResponse
    {
        return $this->Response('HTTP/1.1 400 Bad Request', $code, $body);
    }

    protected function Unauthorized(?int $code = 401): HttpResponse
    {
        return $this->Response('HTTP/1.1 401 Unauthorized', $code);
    }

    protected function Forbidden(string $body = NULL, ?int $code = 400): HttpResponse
    {
        return $this->Response('HTTP/1.1 403 Forbidden', $code, $body);
    }

    private function Response(string $header, int $code, ?string $body = NULL): HttpResponse
    {
        $this->response->SetHeader($header);
        $this->response->SetBody($body);
        $this->response->SetCode($code);
        return $this->response;
    }

}