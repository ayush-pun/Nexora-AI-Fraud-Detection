package com.nexora_backend.fraud.prediction;

import com.nexora_backend.fraud.prediction.dto.request.PredictionRequest;
import com.nexora_backend.fraud.prediction.dto.response.PredictionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Optional;

@Slf4j
@Component
public class MlPredictionClient {

    private final RestClient restClient;
    private final String apiKey;

    public MlPredictionClient(
            @Qualifier("mlRestClient") RestClient restClient,
            @Value("${nexora.ml.api-key}") String apiKey
    ) {
        this.restClient = restClient;
        this.apiKey = apiKey;
    }

    public Optional<PredictionResponse> predict(PredictionRequest request) {

        try {
            PredictionResponse response = restClient.post()
                    .uri("/predict")
                    .header("X-API-Key", apiKey)
                    .body(request)
                    .retrieve()
                    .body(PredictionResponse.class);

            return Optional.ofNullable(response);

        } catch (RestClientResponseException http) {

            log.warn(
                    "ML /predict returned HTTP {} — body: {}",
                    http.getStatusCode(),
                    http.getResponseBodyAsString()
            );

            return Optional.empty();

        } catch (Exception ex) {

            log.warn(
                    "ML /predict could not connect: {}: {}",
                    ex.getClass().getSimpleName(),
                    ex.getMessage()
            );

            return Optional.empty();
        }
    }
}