import type { School } from '../types'

interface Props {
  quanju: School[]
  xuequ: School[]
  getLevelText: (level: number) => string
  onBack: () => void
}

export default function VolunteerResult({ quanju, xuequ, getLevelText, onBack }: Props) {
  const handleCopy = () => {
    let text = '【西城区小升初志愿表】\n\n'
    text += '### 第一批次：全区派位志愿\n'
    quanju.forEach((s, i) => {
      text += `${i+1}. ${s.schoolName}（${getLevelText(s.level)}，2025中签率：${s.rate2025}%）\n`
    })
    text += '\n### 第二批次：学区派位志愿\n'
    xuequ.forEach((s, i) => {
      text += `${i+1}. ${s.schoolName}（${getLevelText(s.level)}，2025中签率：${s.rate2025}%）\n`
    })
    text += '\n⚠️ 本结果仅供参考，最终请以官方系统填报为准'

    navigator.clipboard.writeText(text)
    alert('志愿表已复制到剪贴板')
  }

  const getLevelTag = (level: number) => {
    if (level >= 4) return '冲'
    if (level === 3) return '稳'
    return '保'
  }

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'bg-danger text-white'
    if (level === 3) return 'bg-warning text-white'
    return 'bg-success text-white'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark">您的最终志愿表</h2>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-medium rounded-lg text-gray-dark hover:bg-gray-light transition-colors"
          >
            返回修改
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            复制志愿表
          </button>
        </div>
      </div>

      {/* 全区派位 */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">第一批次：全区派位志愿（共5所）</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-medium">
                <th className="text-left py-3 px-4 text-gray-dark font-medium">志愿顺序</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">学校名称</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">定位</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">2025中签率</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">中考评级</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">标签</th>
              </tr>
            </thead>
            <tbody>
              {quanju.map((school, index) => (
                <tr key={school.schoolId} className="border-b border-gray-medium/50 hover:bg-gray-light/30">
                  <td className="py-3 px-4 font-medium">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{school.schoolName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelColor(school.level)}`}>
                      {getLevelTag(school.level)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{school.rate2025}%</td>
                  <td className="py-3 px-4">{school.score}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {school.tag.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-light rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学区派位 */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">第二批次：学区派位志愿（共{xuequ.length}所）</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-medium">
                <th className="text-left py-3 px-4 text-gray-dark font-medium">志愿顺序</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">学校名称</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">定位</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">2025中签率</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">中考评级</th>
                <th className="text-left py-3 px-4 text-gray-dark font-medium">标签</th>
              </tr>
            </thead>
            <tbody>
              {xuequ.map((school, index) => (
                <tr key={school.schoolId} className="border-b border-gray-medium/50 hover:bg-gray-light/30">
                  <td className="py-3 px-4 font-medium">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{school.schoolName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelColor(school.level)}`}>
                      {getLevelTag(school.level)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{school.rate2025}%</td>
                  <td className="py-3 px-4">{school.score}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {school.tag.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-light rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 注意事项 */}
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-warning mb-3">填报注意事项</h3>
        <ul className="space-y-2 text-sm text-warning/90">
          <li>• 本系统生成的志愿表仅作为参考，最终请以官方填报系统的要求和规则为准</li>
          <li>• 派位结果由官方系统随机摇号产生，本系统不做任何录取承诺</li>
          <li>• 请仔细核对学校名称和志愿顺序，避免填报错误</li>
          <li>• 填报截止前请多次确认志愿信息，提交后无法修改</li>
        </ul>
      </div>
    </div>
  )
}
