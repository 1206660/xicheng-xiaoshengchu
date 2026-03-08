import type { School } from '../types'

interface Props {
  selected: School[]
  onChange: (schools: School[]) => void
  availableSchools: School[]
  getLevelText: (level: number) => string
}

const volunteerOrder = ['1', '2', '3', '4', '5']
const volunteerTips = ['超热门冲刺', '高热度冲刺', '中等稳妥', '稳妥保底', '兜底必保']

export default function QuanjuVolunteer({ selected, onChange, availableSchools, getLevelText }: Props) {
  const handleSelect = (index: number, schoolId: string) => {
    const school = availableSchools.find(s => s.schoolId === schoolId)
    if (!school) return

    const newSelected = [...selected]
    newSelected[index] = school
    onChange(newSelected)
  }

  const handleRemove = (index: number) => {
    const newSelected = [...selected]
    newSelected.splice(index, 1)
    onChange(newSelected)
  }

  const handleAutoFill = () => {
    // 自动按冲稳保策略填充
    const level5 = availableSchools.filter(s => s.level === 5).slice(0, 2)
    const level4 = availableSchools.filter(s => s.level === 4).slice(0, 1)
    const level3 = availableSchools.filter(s => s.level === 3).slice(0, 1)
    const level1 = availableSchools.filter(s => s.level === 1).slice(0, 1)

    const autoSelected = [...level5, ...level4, ...level3, ...level1]
    onChange(autoSelected.slice(0, 5))
  }

  const usedSchoolIds = selected.map(s => s.schoolId)
  const options = availableSchools.filter(s => !usedSchoolIds.includes(s.schoolId))

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-dark">第一批次：全区派位志愿</h2>
          <p className="text-sm text-gray-dark mt-1">最多可填报5所学校，遵循冲稳保策略，平行志愿顺序优先</p>
        </div>
        <button
          onClick={handleAutoFill}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          一键智能填充
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {volunteerOrder.map((order, index) => {
          const selectedSchool = selected[index]
          return (
            <div key={order} className="border border-gray-medium rounded-lg p-4 bg-gray-light/30">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {order}
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {volunteerTips[index]}
                </span>
              </div>

              {selectedSchool ? (
                <div className="space-y-2">
                  <div className="font-medium text-dark text-sm">{selectedSchool.schoolName}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${
                      selectedSchool.level >=4 ? 'bg-danger/10 text-danger' : 
                      selectedSchool.level ===3 ? 'bg-warning/10 text-warning' : 
                      'bg-success/10 text-success'
                    }`}>
                      {getLevelText(selectedSchool.level)}
                    </span>
                    <span className="text-gray-dark">中签率: {selectedSchool.rate2025}%</span>
                  </div>
                  <button
                    onClick={() => handleRemove(index)}
                    className="w-full py-1 text-xs text-gray-dark hover:text-danger transition-colors border-t border-gray-medium mt-2 pt-2"
                  >
                    移除
                  </button>
                </div>
              ) : (
                <select
                  value=""
                  onChange={(e) => handleSelect(index, e.target.value)}
                  className="w-full text-sm px-2 py-2 border border-gray-medium rounded bg-white outline-none focus:border-primary"
                >
                  <option value="">请选择学校</option>
                  {options.map(s => (
                    <option key={s.schoolId} value={s.schoolId}>
                      {s.schoolName}（{getLevelText(s.level)}，{s.rate2025}%）
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
