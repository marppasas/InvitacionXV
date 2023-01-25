<?php

namespace Controllers;

use PDO;
use System\HttpResponse;

class AsistController extends ControllerBase {

    private const AVAILABLE_FOOD_TAGS = [
        "vegetariano",
        "vegano",
        "celíaco",
        "diabético"
    ];

    public function SendAsist(string $firstName, string $lastName, string $dni, string $foodTags, bool $useBus, string $phone = null, bool $override = FALSE): HttpResponse
    {
        if (is_null($firstName) || strlen(trim($firstName)) == 0) {
            return $this->BadRequest("El campo Nombre es obligatorio.");
        }
        
        if (is_null($lastName) || strlen(trim($lastName)) == 0) {
            return $this->BadRequest("El campo Apellido es obligatorio.");
        }

        $dni = $this->FixDNI($dni);
        if (is_null($dni)) {
            return $this->BadRequest("El número de cédula es inválida.");
        }
        
        $tags = explode(",", $foodTags);
        foreach ($tags as &$tag) {
            $tag = trim(mb_strtolower($tag));
            if (!in_array($tag, self::AVAILABLE_FOOD_TAGS)) {
                return $this->BadRequest("\"{ucfirst($tag)}\" no es un menú disponible.");
            }
        }
        $foodTags = count($tags) > 0 ? ucfirst(implode(", ", $tags)) : NULL;

        if (!$this->ValidatePhone($phone)) {
            return $this->BadRequest("El número de celular no es válido.");
        }

        $qry = $this->db->prepare("SELECT COUNT(*) FROM asist WHERE dni = :dni");
        $qry->execute([
            "dni" => $dni
        ]);
        if ($qry->fetch(PDO::FETCH_ASSOC)["COUNT(*)"] > 0) {
            return $this->Forbidden("La cédula $dni ya fue confirmada.");
        }

        $qry = $this->db->prepare("INSERT INTO asist VALUES (NULL, :firstName, :lastName, :dni, :foodTags, :useBus, :phone, CURRENT_TIMESTAMP, NULL)");
        $qry->execute([
            "firstName" => $firstName,
            "lastName" => $lastName,
            "dni" => $dni,
            "foodTags" => $foodTags,
            "useBus" => $useBus,
            "phone" => $phone,
        ]);
        
        return $this->NoContent();
    }

    private function FixDNI(string $dni): ?string
    {
        $dni = preg_replace("/(\.|\-)/", "", $dni);
        if (!in_array(strlen($dni), [7, 8]) || $dni[0] == "0") {
            return NULL;
        }

        if (strlen($dni) == 7) {
            return substr($dni, 0, 3) . "." . substr($dni, 3, 3) . "-" . substr($dni, 6);
        } else {
            return substr($dni, 0, 1) . "." . substr($dni, 1, 3). "." . substr($dni, 4, 3) . "-" . substr($dni, 7);
        }
    }

    private function ValidatePhone(string &$phone): bool
    {
        if (is_null($phone) || strlen(trim($phone)) == 0) {
            $phone = "";
            return TRUE;
        }
        
        $phone = trim($phone);
        return preg_match("/^09[0-9]{7}$/", $phone);
    }

}