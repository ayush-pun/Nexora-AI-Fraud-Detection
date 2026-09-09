package com.nexora_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class MlClientConfig {

    @Bean
    public RestClient mlRestClient(
            @Value("${nexora.ml.base-url}") String baseUrl,
            @Value("${nexora.ml.api-key}") String apiKey,
            @Value("${nexora.ml.connect-timeout-ms:2000}") long connectMs,
            @Value("${nexora.ml.read-timeout-ms:3000}") long readMs) {

        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)   // <-- uvicorn (h11) is HTTP/1.1 only
                .connectTimeout(Duration.ofMillis(connectMs))
                .build();

        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(Duration.ofMillis(readMs));

        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-API-Key", apiKey)
                .requestFactory(factory)
                .build();
    }
}