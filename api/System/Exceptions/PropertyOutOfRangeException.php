<?php

namespace System\Exceptions;

use Exception;
use WebApi\Headers;

class PropertyOutOfRangeException extends Exception {
    private string $header;

    public function getHeader(): string
    {
        return $this->header;
    }

    public function __construct(string $message = "El parámetro se encuentra fuera de rango.") {
        $this->message = $message;
        $this->header = Headers::BadRequest;
        $this->code = 400;
        parent::__construct($message, $this->code, NULL);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}