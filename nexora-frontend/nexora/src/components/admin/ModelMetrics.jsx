import { Activity, AlertTriangle, Brain, RefreshCw } from "lucide-react";
import { useModelMetrics } from "../../services/admin/modelMetrics.query";

const formatMetricName = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatMetricValue = (value) => {
  if (typeof value !== "number") {
    return String(value ?? "-");
  }

  // Metrics such as accuracy, precision, recall etc.
  // are commonly returned as 0-1.
  if (value >= 0 && value <= 1) {
    return `${(value * 100).toFixed(2)}%`;
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
};

const ModelMetrics = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useModelMetrics();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3">
            <Brain className="text-indigo-600" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ML Model Performance
            </h2>

            <p className="text-sm text-slate-500">
              Loading machine learning metrics...
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
                ML Model Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Machine learning metrics are currently unavailable.
              </p>

              <p className="mt-2 text-xs text-amber-600">
                The ML service is not responding. The backend can be
                connected when the service becomes available.
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

  if (!data || typeof data !== "object") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="text-indigo-600" size={22} />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ML Model Performance
            </h2>

            <p className="text-sm text-slate-500">
              No model metrics are available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const entries = Object.entries(data).filter(
    ([, value]) =>
      typeof value === "number" ||
      typeof value === "string"
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-3">
          <Brain className="text-indigo-600" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            ML Model Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Performance metrics from the deployed fraud detection model.
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">
          No model metrics available.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <p className="text-sm font-medium text-slate-500">
                {formatMetricName(key)}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatMetricValue(value)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ModelMetrics;