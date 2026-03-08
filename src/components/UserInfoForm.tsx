import { useState } from 'react'
import type { District } from '../types'

interface Props {
  districts: District[]
  onSubmit: (district: string, primarySchool: string, preference: string) => void
}

const primarySchools = [
  '德胜学区第一小学', '德胜学区第二小学', '什刹海小学', '西长安街小学',
  '大栅栏小学', '新街口小学', '金融街小学', '陶然亭小学',
  '展览路小学', '月坛小学', '广安门内小学', '广安门外小学'
]

export default function UserInfoForm({ districts, onSubmit }: Props) {
  const [district, setDistrict] = useState('')
  const [primarySchool, setPrimarySchool] = useState('')
  const [preference, setPreference] = useState('score')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!district || !primarySchool) return
    onSubmit(district, primarySchool, preference)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark mb-2">欢迎使用志愿填报辅助系统</h2>
        <p className="text-gray-dark">请先填写您的基本信息，我们将为您匹配可报学校</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-2">
            所属学区 <span className="text-danger">*</span>
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-3 border border-gray-medium rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            required
          >
            <option value="">请选择学区</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-dark mb-2">
            所在小学 <span className="text-danger">*</span>
          </label>
          <select
            value={primarySchool}
            onChange={(e) => setPrimarySchool(e.target.value)}
            className="w-full px-4 py-3 border border-gray-medium rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            required
          >
            <option value="">请选择小学</option>
            {primarySchools.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-dark mb-2">
            填报偏好
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${preference === 'score' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-medium hover:border-primary/50'}`}>
              <input
                type="radio"
                name="preference"
                value="score"
                checked={preference === 'score'}
                onChange={(e) => setPreference(e.target.value)}
                className="hidden"
              />
              <span>优先中考成绩</span>
            </label>
            <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${preference === 'distance' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-medium hover:border-primary/50'}`}>
              <input
                type="radio"
                name="preference"
                value="distance"
                checked={preference === 'distance'}
                onChange={(e) => setPreference(e.target.value)}
                className="hidden"
              />
              <span>优先离家近</span>
            </label>
            <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${preference === 'reputation' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-medium hover:border-primary/50'}`}>
              <input
                type="radio"
                name="preference"
                value="reputation"
                checked={preference === 'reputation'}
                onChange={(e) => setPreference(e.target.value)}
                className="hidden"
              />
              <span>优先学校口碑</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          开始填报
        </button>
      </form>
    </div>
  )
}
