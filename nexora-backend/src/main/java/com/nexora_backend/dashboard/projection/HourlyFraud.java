package com.nexora_backend.dashboard.projection;

public interface HourlyFraud {
    int getHour();
    long getTotal();
    long getFraud();                   // REVIEW + BLOCK in that hour
}
