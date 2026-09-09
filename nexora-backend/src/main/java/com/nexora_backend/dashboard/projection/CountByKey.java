package com.nexora_backend.dashboard.projection;

public interface CountByKey {          // generic {label, count} row
    String getLabel();
    long getCount();
}