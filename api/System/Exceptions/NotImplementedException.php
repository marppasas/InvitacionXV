<?php

namespace System\Exceptions;

use Exception;
use WebApi\Headers;

class NotImplementedException extends Exception {
    private string $header;

    public function getHeader(): string
    {
        return $this->header;
    }

    public function __construct(string $message = "El servidor no soporta la funcionalidad requerida para completar la solicitud.") {
        $this->message = $message;
        $this->header = Headers::NotImplemented;
        $this->code = 501;
        parent::__construct($message, $this->code, NULL);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}