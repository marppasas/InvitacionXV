<?php

namespace System\Exceptions;

use WebApi\Headers;

class ApiException extends WebException
{
    private string $header;

    public function getHeader(): string
    {
        return $this->header;
    }

    public function __construct(string $message, string $header = Headers::InternalServerError) {
        $this->message = $message;
        $this->header = $header;
        $this->code = explode(" ", $header)[1];
        parent::__construct($message, $this->code, NULL);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}