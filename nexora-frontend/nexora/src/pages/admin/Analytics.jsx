import ModelMetrics from "../../components/admin/ModelMetrics";
import ShapExplainability from "../../components/admin/ShapExplainability";

const Analytics = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Analytics
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor fraud detection performance, machine learning
          metrics, and model explainability.
        </p>
      </div>

      {/* ML Model Metrics */}
      <div className="mb-6">
        <ModelMetrics />
      </div>

      {/* SHAP */}
      <div>
        <ShapExplainability />
      </div>
    </div>
  );
};

export default Analytics;