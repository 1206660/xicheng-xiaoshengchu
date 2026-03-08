import { useState, useEffect } from 'react'
import type { District } from '../types'

interface Props {
  districts: District[]
  onSubmit: (district: string, primarySchool: string, preference: string) => void
}

// 学区对应小学数据
const districtSchools: Record<string, string[]> = {
  'desheng': [
    '德胜学区第一小学', '德胜学区第二小学', '育翔小学', '西师附小', '五路通小学', '实验二小德胜校区'
  ],
  'shichahai': [
    '什刹海小学', '厂桥小学', '黄城根小学', '雷锋小学', '鸦儿胡同小学'
  ],
  'xichangan': [
    '西长安街小学', '实验二小', '自忠小学', '力学小学', '顺城街第一小学'
  ],
  'dazhalan': [
    '大栅栏小学', '炭儿胡同小学', '实验小学', '新世纪实验小学'
  ],
  'xinjiekou': [
    '新街口小学', '黄城根小学分校', '志成小学', '京师附小'
  ],
  'jinrongjie': [
    '金融街小学', '实验二小涭水河分校', '宏庙小学', '西单小学'
  ],
  'taoranting': [
    '陶然亭小学', '宣师一附小', '白纸坊小学', '半步桥小学'
  ],
  'zhanlanlu': [
    '展览路小学', '进步小学', '西外附小', '建大附小'
  ],
  'yuetan': [
    '月坛小学', '中古友谊小学', '三里河三小', '复兴门外一小'
  ],
  'guanganniu': [
    '广安门内小学', '北京小学', '康乐里小学', '回民小学'
  ],
  'guanganmenwai': [
    '广安门外小学', '北京小学天宁寺分校', '实验二小广外分校', '红莲小学'
  ]
}

export default function UserInfoForm({ districts, onSubmit }: Props) {
  const [district, setDistrict] = useState('')
  const [primarySchool, setPrimarySchool] = useState('')
  const [preference, setPreference] = useState('score')
  const [availableSchools, setAvailableSchools] = useState<string[]>([])

  useEffect(() => {
    if (district && districtSchools[district]) {
      setAvailableSchools(districtSchools[district])
      setPrimarySchool('') // 切换学区时清空已选小学
    } else {
      setAvailableSchools([])
    }
  }, [district])

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
            disabled={!district}
            required
          >
            <option value="">{district ? '请选择小学' : '请先选择学区'}</option>
            {availableSchools.map(s => (
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
