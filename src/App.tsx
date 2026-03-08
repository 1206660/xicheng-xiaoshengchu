import { useState } from 'react'
import './App.css'
import { districts, schools } from './data/schools.json'
import UserInfoForm from './components/UserInfoForm'
import QuanjuVolunteer from './components/QuanjuVolunteer'
import XuequVolunteer from './components/XuequVolunteer'
import ValidationResult from './components/ValidationResult'
import VolunteerResult from './components/VolunteerResult'
import SchoolLibrary from './components/SchoolLibrary'
import type { School } from './types'

const typedSchools = schools as unknown as School[]

type AppState = 'form' | 'fill' | 'result' | 'library'

function App() {
  const [state, setState] = useState<AppState>('form')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedPrimarySchool, setSelectedPrimarySchool] = useState('')
  const [preference, setPreference] = useState('score')
  const [quanjuSelected, setQuanjuSelected] = useState<School[]>([])
  const [xuequSelected, setXuequSelected] = useState<School[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])

  const availableQuanjuSchools = typedSchools.filter(s => s.type !== 'area')
  const availableXuequSchools = typedSchools.filter(s => 
    (s.type !== 'all' || s.district.includes(selectedDistrict)) && 
    !quanjuSelected.some(q => q.schoolId === s.schoolId)
  )

  const validate = () => {
    const errors: string[] = []
    const warnings: string[] = []

    if (quanjuSelected.length !== 5) {
      errors.push('全区派位必须填报5所学校')
    }

    const xuequRequiredCount = typedSchools.filter(s => s.district.includes(selectedDistrict)).length
    if (xuequSelected.length !== xuequRequiredCount) {
      errors.push(`学区派位必须填报本学区全部${xuequRequiredCount}所学校`)
    }

    const duplicateSchools = quanjuSelected.filter(q => xuequSelected.some(x => x.schoolId === q.schoolId))
    if (duplicateSchools.length > 0) {
      errors.push(`以下学校不能同时出现在全区派位和学区派位中：${duplicateSchools.map(s => s.schoolName).join('、')}`)
    }

    const hasDunDi = quanjuSelected.some(s => s.level === 1) || xuequSelected.some(s => s.level === 1)
    if (!hasDunDi) {
      warnings.push('未选择兜底学校，存在滑档风险')
    }

    const allHighLevel = quanjuSelected.every(s => s.level >= 4)
    if (allHighLevel) {
      warnings.push('全区派位全部为高热度学校，整体中签率较低')
    }

    setValidationErrors(errors)
    setValidationWarnings(warnings)

    return errors.length === 0
  }

  const handleFormSubmit = (district: string, primarySchool: string, pref: string) => {
    setSelectedDistrict(district)
    setSelectedPrimarySchool(primarySchool)
    setPreference(pref)
    setState('fill')
  }

  const handleGenerateResult = () => {
    if (validate()) {
      setState('result')
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-light">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              西
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark">西城区小升初志愿填报辅助系统</h1>
              <p className="text-sm text-gray-dark">2025年最新政策 | 智能推荐 | 风险校验</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setState(state === 'library' ? 'fill' : 'library')}
              className="px-4 py-2 border border-gray-medium rounded-lg text-gray-dark hover:bg-gray-light transition-colors"
            >
              {state === 'library' ? '返回填报' : '学校库'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state === 'form' && (
          <UserInfoForm onSubmit={handleFormSubmit} districts={districts} />
        )}

        {state === 'fill' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-dark mb-4">填报信息</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-dark">所属学区：</span>
                  <span className="font-medium">{districts.find(d => d.id === selectedDistrict)?.name}</span>
                </div>
                <div>
                  <span className="text-gray-dark">所在小学：</span>
                  <span className="font-medium">{selectedPrimarySchool}</span>
                </div>
                <div>
                  <span className="text-gray-dark">填报偏好：</span>
                  <span className="font-medium">{preference === 'score' ? '优先中考成绩' : preference === 'distance' ? '优先离家近' : '优先学校口碑'}</span>
                </div>
              </div>
            </div>

            <QuanjuVolunteer 
              selected={quanjuSelected}
              onChange={setQuanjuSelected}
              availableSchools={availableQuanjuSchools}
              getLevelText={getLevelText}
            />

            <XuequVolunteer 
              selected={xuequSelected}
              onChange={setXuequSelected}
              availableSchools={availableXuequSchools}
              getLevelText={getLevelText}
              districtId={selectedDistrict}
            />

            <ValidationResult 
              errors={validationErrors}
              warnings={validationWarnings}
              onValidate={validate}
              onGenerate={handleGenerateResult}
            />
          </div>
        )}

        {state === 'result' && (
          <VolunteerResult 
            quanju={quanjuSelected}
            xuequ={xuequSelected}
            getLevelText={getLevelText}
            onBack={() => setState('fill')}
          />
        )}

        {state === 'library' && (
          <SchoolLibrary schools={typedSchools} districts={districts} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-medium mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-dark">
          <p>© 2025 西城区小升初志愿填报辅助系统 | 数据仅供参考，最终请以官方政策为准</p>
        </div>
      </footer>
    </div>
  )
}

export default App
