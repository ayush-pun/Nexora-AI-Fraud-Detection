package com.nexora_backend.dashboard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class MlMetricsClient {

    private final RestClient restClient;

    public MlMetricsClient(@Qualifier("mlRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public Optional<Object> get(String path) {          // "/metrics" or "/shap"
        try {
            return Optional.ofNullable(restClient.get().uri(path).retrieve().body(Object.class));
        } catch (Exception ex) {
            log.warn("ML {} failed: {}", path, ex.getMessage());
            return Optional.empty();
        }
    }
}