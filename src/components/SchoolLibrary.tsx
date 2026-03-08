import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { School, District } from '../types'

interface Props {
  schools: School[]
  districts: District[]
}

export default function SchoolLibrary({ schools, districts }: Props) {
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

  const filteredSchools = schools.filter(s => {
    if (selectedDistrict && !s.district.includes(selectedDistrict)) return false
    if (selectedLevel && s.level.toString() !== selectedLevel) return false
    if (searchKeyword && !s.schoolName.includes(searchKeyword)) return false
    return true
  })

  const getLevelText = (level: number) => {
    const map = {
      1: '兜底',
      2: '稳妥',
      3: '中等',
      4: '高热度',
      5: '超热门'
    }
    return map[level as keyof typeof map]
  }

  const getLevelColor = (level: number) => {
    if (level >=4) return 'bg-danger text-white'
    if (level ===3) return 'bg-warning text-white'
    return 'bg-success text-white'
  }

  const getChartData = (school: School) => {
    return [
      { year: '2023', rate: school.rate2023 },
      { year: '2024', rate: school.rate2024 },
      { year: '2025', rate: school.rate2025 },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark">学校数据库</h2>
        {selectedSchool && (
          <button
            onClick={() => setSelectedSchool(null)}
            className="px-4 py-2 border border-gray-medium rounded-lg text-gray-dark hover:bg-gray-light transition-colors"
          >
            返回列表
          </button>
        )}
      </div>

      {!selectedSchool ? (
        <>
          {/* 筛选栏 */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">所属学区</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-medium rounded-lg outline-none focus:border-primary"
                >
                  <option value="">全部学区</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">热度等级</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-medium rounded-lg outline-none focus:border-primary"
                >
                  <option value="">全部等级</option>
                  <option value="5">超热门（5级）</option>
                  <option value="4">高热度（4级）</option>
                  <option value="3">中等（3级）</option>
                  <option value="2">稳妥（2级）</option>
                  <option value="1">兜底（1级）</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">学校名称</label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索学校名称"
                  className="w-full px-3 py-2 border border-gray-medium rounded-lg outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedDistrict('')
                    setSelectedLevel('')
                    setSearchKeyword('')
                  }}
                  className="w-full px-3 py-2 border border-gray-medium rounded-lg text-gray-dark hover:bg-gray-light transition-colors"
                >
                  重置筛选
                </button>
              </div>
            </div>
          </div>

          {/* 学校列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map(school => (
              <div
                key={school.schoolId}
                onClick={() => setSelectedSchool(school)}
                className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-dark">{school.schoolName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(school.level)}`}>
                    {getLevelText(school.level)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-dark">2025中签率</span>
                    <span className="font-medium">{school.rate2025}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-dark">2025招生计划</span>
                    <span className="font-medium">{school.plan2025}人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-dark">中考评级</span>
                    <span className="font-medium">{school.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-dark">所属学区</span>
                    <span className="font-medium">
                      {school.district.map(d => districts.find(dist => dist.id === d)?.name).join('、')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {school.tag.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-light rounded-full text-xs text-gray-dark">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-dark mb-2">{selectedSchool.schoolName}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(selectedSchool.level)}`}>
                  {getLevelText(selectedSchool.level)}
                </span>
                <span className="text-sm text-gray-dark">中考评级：{selectedSchool.score}</span>
                <span className="text-sm text-gray-dark">地址：{selectedSchool.address}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-light/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{selectedSchool.rate2025}%</div>
              <div className="text-sm text-gray-dark">2025中签率</div>
            </div>
            <div className="bg-gray-light/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{selectedSchool.plan2025}</div>
              <div className="text-sm text-gray-dark">2025招生计划（人）</div>
            </div>
            <div className="bg-gray-light/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{selectedSchool.apply2025}</div>
              <div className="text-sm text-gray-dark">2025报名人数</div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-dark mb-4">近3年中签率趋势</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData(selectedSchool)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#165DFF" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-dark mb-4">历年招生数据</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-medium">
                    <th className="text-left py-3 px-4 text-gray-dark font-medium">年份</th>
                    <th className="text-left py-3 px-4 text-gray-dark font-medium">招生计划（人）</th>
                    <th className="text-left py-3 px-4 text-gray-dark font-medium">报名人数（人）</th>
                    <th className="text-left py-3 px-4 text-gray-dark font-medium">中签率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-medium/50">
                    <td className="py-3 px-4">2025</td>
                    <td className="py-3 px-4">{selectedSchool.plan2025}</td>
                    <td className="py-3 px-4">{selectedSchool.apply2025}</td>
                    <td className="py-3 px-4">{selectedSchool.rate2025}%</td>
                  </tr>
                  <tr className="border-b border-gray-medium/50">
                    <td className="py-3 px-4">2024</td>
                    <td className="py-3 px-4">{selectedSchool.plan2024}</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">{selectedSchool.rate2024}%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">2023</td>
                    <td className="py-3 px-4">{selectedSchool.plan2023}</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">{selectedSchool.rate2023}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
