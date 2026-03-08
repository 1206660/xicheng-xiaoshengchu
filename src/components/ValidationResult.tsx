interface Props {
  errors: string[]
  warnings: string[]
  onValidate: () => void
  onGenerate: () => void
}

export default function ValidationResult({ errors, warnings, onValidate, onGenerate }: Props) {
  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-lg font-semibold text-dark mb-4">合规性校验结果</h2>

      <div className="space-y-4 mb-6">
        {hasErrors && (
          <div className="p-4 bg-danger/5 border border-danger/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-danger">校验不通过（{errors.length}个错误）</span>
            </div>
            <ul className="ml-7 list-disc text-sm text-danger/90 space-y-1">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {hasWarnings && (
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-warning">存在风险提示（{warnings.length}个警告）</span>
            </div>
            <ul className="ml-7 list-disc text-sm text-warning/90 space-y-1">
              {warnings.map((warn, index) => (
                <li key={index}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasErrors && !hasWarnings && (
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-success">校验通过，志愿符合填报规则</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onValidate}
          className="px-6 py-2 border border-gray-medium rounded-lg text-gray-dark hover:bg-gray-light transition-colors"
        >
          重新校验
        </button>
        <button
          onClick={onGenerate}
          disabled={hasErrors}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            hasErrors 
              ? 'bg-gray-medium text-white cursor-not-allowed' 
              : 'bg-success text-white hover:bg-success/90 shadow-lg shadow-success/20'
          }`}
        >
          生成最终志愿表
        </button>
      </div>
    </div>
  )
}
