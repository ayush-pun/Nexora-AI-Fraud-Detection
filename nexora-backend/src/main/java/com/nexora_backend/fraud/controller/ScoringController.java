package com.nexora_backend.fraud.controller;

import com.nexora_backend.fraud.prediction.MlPredictionClient;
import com.nexora_backend.fraud.prediction.dto.request.PredictionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scoring")
@RequiredArgsConstructor
public class ScoringController {

    private final MlPredictionClient mlClient;

    @PostMapping("/test")
    public ResponseEntity<?> test(@RequestBody PredictionRequest request) {
        return mlClient.predict(request)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "ML service unavailable", "degraded", true)));
    }
}