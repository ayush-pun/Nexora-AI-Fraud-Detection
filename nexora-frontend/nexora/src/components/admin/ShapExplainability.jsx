import {
  Brain,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";

import { useGlobalShap } from "../../services/admin/shap.query";

const formatFeatureName = (name) => {
  return String(name)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getNumericValue = (value) => {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? 0 : parsed;
};

const ShapExplainability = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGlobalShap();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-50 p-3">
            <Brain className="text-purple-600" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              SHAP Explainability
            </h2>

            <p className="text-sm text-slate-500">
              Loading global feature importance...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="rounded-xl bg-amber-50 p-3">
              <AlertTriangle
                className="text-amber-600"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                SHAP Explainability
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                SHAP explanations are currently unavailable.
              </p>

              <p className="mt-2 text-xs text-amber-600">
                The ML SHAP service is not responding. This section
                is ready for the ML service integration.
              </p>

              {error?.response?.data?.error && (
                <p className="mt-2 text-xs text-slate-400">
                  {error.response.data.error}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin" : ""}
            />

            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Info className="text-slate-400" size={22} />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              SHAP Explainability
            </h2>

            <p className="text-sm text-slate-500">
              No SHAP data is available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
   * The backend currently documents the successful response
   * as an empty object `{}`.
   *
   * Therefore we support several possible response shapes
   * without hard-coding one.
   */

  let features = [];

  if (Array.isArray(data)) {
    features = data;
  } else if (Array.isArray(data.features)) {
    features = data.features;
  } else if (Array.isArray(data.featureImportance)) {
    features = data.featureImportance;
  } else if (Array.isArray(data.values)) {
    features = data.values;
  } else {
    features = Object.entries(data)
      .filter(([, value]) => typeof value === "number")
      .map(([feature, value]) => ({
        feature,
        value,
      }));
  }

  if (features.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Info className="text-slate-400" size={22} />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              SHAP Explainability
            </h2>

            <p className="text-sm text-slate-500">
              SHAP service is connected, but no feature importance
              data has been returned.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const normalizedFeatures = features
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
      ) {
        return {
          feature:
            item.feature ||
            item.name ||
            item.label ||
            "Unknown Feature",

          value:
            item.value ??
            item.shapValue ??
            item.importance ??
            item.meanAbsShap ??
            0,
        };
      }

      return {
        feature: "Feature",
        value: item,
      };
    })
    .map((item) => ({
      ...item,
      numericValue: getNumericValue(item.value),
    }));

  const maxValue = Math.max(
    ...normalizedFeatures.map((item) =>
      Math.abs(item.numericValue)
    ),
    1
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-purple-50 p-3">
          <Brain className="text-purple-600" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            SHAP Explainability
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Global feature importance showing which transaction
            attributes influence fraud predictions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {normalizedFeatures.map((item, index) => {
          const percentage =
            (Math.abs(item.numericValue) / maxValue) * 100;

          return (
            <div key={`${item.feature}-${index}`}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  {formatFeatureName(item.feature)}
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {item.numericValue.toFixed(4)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <div className="flex gap-3">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <p className="text-xs leading-5 text-slate-500">
            SHAP (SHapley Additive exPlanations) helps explain
            which features contribute to the machine learning
            model's fraud prediction. Higher absolute SHAP values
            indicate greater influence on the prediction.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShapExplainability;