import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { School } from '../types'
import { schools } from '../data/schools.json'

interface Props {
  selected: School[]
  onChange: (schools: School[]) => void
  availableSchools: School[]
  getLevelText: (level: number) => string
  districtId: string
}

function SortableItem({ school, getLevelText }: { school: School; getLevelText: (level: number) => string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: school.schoolId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white border border-gray-medium rounded-lg mb-3 hover:border-primary transition-colors"
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-dark hover:text-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <div>
          <div className="font-medium text-dark">{school.schoolName}</div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <span className={`px-1.5 py-0.5 rounded ${
              school.level >=4 ? 'bg-danger/10 text-danger' : 
              school.level ===3 ? 'bg-warning/10 text-warning' : 
              'bg-success/10 text-success'
            }`}>
              {getLevelText(school.level)}
            </span>
            <span className="text-gray-dark">中签率: {school.rate2025}%</span>
            <span className="text-gray-dark">中考评级: {school.score}</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-dark">
        {school.tag.map(tag => (
          <span key={tag} className="ml-2 px-2 py-0.5 bg-gray-light rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function XuequVolunteer({ selected, onChange, availableSchools, getLevelText, districtId }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = selected.findIndex((item) => item.schoolId === active.id)
      const newIndex = selected.findIndex((item) => item.schoolId === over.id)
      onChange(arrayMove(selected, oldIndex, newIndex))
    }
  }

  const handleAutoFill = () => {
    // 自动加载本学区所有学校，过滤已选的全区派位学校
    const xuequSchools = schools.filter(s => s.district.includes(districtId))
    const filtered = xuequSchools.filter(s => !availableSchools.some(a => a.schoolId === s.schoolId))
    // 按热度从高到低排序
    const sorted = filtered.sort((a, b) => b.level - a.level)
    onChange(sorted)
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-dark">第二批次：学区派位志愿</h2>
          <p className="text-sm text-gray-dark mt-1">必须填报本学区全部初中，支持拖拽调整顺序，已自动过滤全区派位已选学校</p>
        </div>
        <button
          onClick={handleAutoFill}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          一键加载本学区学校
        </button>
      </div>

      <div className="bg-gray-light/30 rounded-lg p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selected.map(s => s.schoolId)}
            strategy={verticalListSortingStrategy}
          >
            {selected.length > 0 ? (
              selected.map(school => (
                <SortableItem key={school.schoolId} school={school} getLevelText={getLevelText} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-dark">
                点击「一键加载本学区学校」加载可填报学校
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
