'use client'

import React, { useState } from 'react'
import { 
  Home, PlusCircle, CheckSquare, Bot, PiggyBank, Plus, Trash2, Calendar as CalendarIcon, 
  TrendingUp, Wallet, ArrowUpRight, Check, X, ShieldAlert, Sparkles, Tag
} from 'lucide-react'

export default function LifeOSDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'input' | 'savings' | 'tasks' | 'ai'>('home')

  // --- 1. カテゴリー自由追加のState ---
  const [categories, setCategories] = useState<string[]>([
    '食費', '日用品', '交際費', '固定費', '自己投資', '趣味・娯楽'
  ])
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  // --- 2. 目的別貯金（奨学金返済等）のState ---
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: '奨学金返済', target: 1500000, current: 450000, targetDate: '2028-03-31' },
    { id: 2, name: '旅行・特別資金', target: 500000, current: 200000, targetDate: '2027-08-31' },
    { id: 3, name: '緊急防衛資金', target: 1000000, current: 750000, targetDate: '2026-12-31' },
  ])
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [newGoalDate, setNewGoalDate] = useState('')
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)

  // --- 3. タスク＆カレンダーのState ---
  const [tasks, setTasks] = useState([
    { id: 1, title: '今日の収支を記録する', category: 'お金', priority: '高', dueDate: '2026-08-11', completed: true },
    { id: 2, title: '新規プロジェクトの見積書送付', category: '仕事・キャリア', priority: '高', dueDate: '2026-08-12', completed: false },
    { id: 3, title: '積み立てNISA配分の見直し', category: 'お金', priority: '中', dueDate: '2026-08-15', completed: false },
    { id: 4, title: '30分の散歩でリフレッシュ', category: '健康・生活', priority: '低', dueDate: '2026-08-11', completed: false },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('お金')
  const [newTaskPriority, setNewTaskPriority] = useState('中')
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0])
  const [taskViewMode, setTaskViewMode] = useState<'list' | 'calendar'>('list')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  // --- 収支入力のフォームState ---
  const [inputAmount, setInputAmount] = useState('')
  const [inputType, setInputType] = useState<'消費' | '浪費' | '投資' | '貯金'>('消費')
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [selectedSavingsGoal, setSelectedSavingsGoal] = useState(savingsGoals[0]?.name || '')
  const [inputMemo, setInputMemo] = useState('')

  // ハンドラー：カテゴリー追加
  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return
    if (!categories.includes(newCategoryInput.trim())) {
      setCategories([...categories, newCategoryInput.trim()])
      setSelectedCategory(newCategoryInput.trim())
    }
    setNewCategoryInput('')
    setIsCategoryModalOpen(false)
  }

  // ハンドラー：貯金目標追加
  const handleAddSavingsGoal = () => {
    if (!newGoalName || !newGoalTarget) return
    const newGoal = {
      id: Date.now(),
      name: newGoalName,
      target: Number(newGoalTarget),
      current: 0,
      targetDate: newGoalDate || '2027-12-31',
    }
    setSavingsGoals([...savingsGoals, newGoal])
    setNewGoalName('')
    setNewGoalTarget('')
    setNewGoalDate('')
    setIsGoalModalOpen(false)
  }

  // ハンドラー：タスク追加
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      completed: false,
    }
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setIsTaskModalOpen(false)
  }

  // ハンドラー：タスク削除
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // ハンドラー：タスク完了切替
  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  // 収支記録の送信（貯金目的がある場合は貯金総額にも反映）
  const handleRecordTransaction = () => {
    if (!inputAmount) return
    const amount = Number(inputAmount)

    if (inputType === '貯金' && selectedSavingsGoal) {
      setSavingsGoals(savingsGoals.map(g => 
        g.name === selectedSavingsGoal ? { ...g, current: g.current + amount } : g
      ))
    }

    alert(`【${inputType}】¥${amount.toLocaleString()} を記録しました！`)
    setInputAmount('')
    setInputMemo('')
    setActiveTab('home')
  }

  // 計算プロパティ
  const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0)
  const totalSavingsCurrent = savingsGoals.reduce((sum, g) => sum + g.current, 0)
  const totalSavingsProgress = Math.round((totalSavingsCurrent / totalSavingsTarget) * 100) || 0

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#2C3527] font-sans pb-28 max-w-md mx-auto relative shadow-2xl overflow-hidden rounded-3xl border border-[#E2E6D8]">
      
      {/* ── ヘッダー ── */}
      <header className="p-5 bg-gradient-to-b from-[#EFEGE6] to-[#F8F9F5] flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-[#748B47]">おかえりなさい、経営者さん</p>
          <h1 className="text-2xl font-black tracking-tight text-[#3E4D27] flex items-center gap-2">
            いぶきの人生経営 <span className="text-lg">🍵</span>
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#5b7039] text-[#F8F9F5] font-black flex items-center justify-center text-sm shadow-md">
          息
        </div>
      </header>

      {/* ── メインコンテンツ ── */}
      <main className="px-5 space-y-6">

        {/* ================= HOME TAB ================= */}
        {activeTab === 'home' && (
          <>
            {/* BS 純資産カード */}
            <div className="bg-gradient-to-br from-[#5b7039] to-[#3B4A23] text-[#F8F9F5] p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-[#D1DCB8] font-bold">
                <span className="flex items-center gap-1"><Wallet className="w-4 h-4"/> 純資産 (BS)</span>
                <span className="bg-[#F4C430] text-[#2C3527] px-2 py-0.5 rounded-full font-black text-[10px]">前月比 +4.2%</span>
              </div>
              <div>
                <p className="text-xs text-[#D1DCB8]">現在の純資産</p>
                <p className="text-3xl font-black tracking-tight">¥3,350,000</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <p className="text-[#D1DCB8]">総資産</p>
                  <p className="font-bold text-sm">¥4,820,000</p>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <p className="text-[#D1DCB8]">負債 (奨学金等)</p>
                  <p className="font-bold text-sm">¥1,470,000</p>
                </div>
              </div>
            </div>

            {/* PL 今月の収支 */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#3E4D27] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-[#748B47]"/> 今月の収支 (PL)
                </h3>
                <span className="text-xs text-gray-500 font-bold">支出 ¥350,000</span>
              </div>

              {/* 比率プログレスバー */}
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div style={{ width: '52%' }} className="bg-[#5b7039]" title="消費 52%"></div>
                <div style={{ width: '18%' }} className="bg-[#F3A2B8]" title="浪費 18%"></div>
                <div style={{ width: '30%' }} className="bg-[#F4C430]" title="投資 30%"></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-[#F2F5ED] p-2.5 rounded-2xl">
                  <p className="text-[10px] text-gray-600 font-bold flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#5b7039]"></span>消費
                  </p>
                  <p className="font-black text-sm text-[#3E4D27]">52%</p>
                  <p className="text-[9px] text-gray-400">¥182,000</p>
                </div>
                <div className="bg-[#FAF0F3] p-2.5 rounded-2xl">
                  <p className="text-[10px] text-gray-600 font-bold flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#F3A2B8]"></span>浪費
                  </p>
                  <p className="font-black text-sm text-[#B84061]">18%</p>
                  <p className="text-[9px] text-gray-400">¥63,000</p>
                </div>
                <div className="bg-[#FAF6E6] p-2.5 rounded-2xl">
                  <p className="text-[10px] text-gray-600 font-bold flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#F4C430]"></span>投資
                  </p>
                  <p className="font-black text-sm text-[#927110]">30%</p>
                  <p className="text-[9px] text-gray-400">¥105,000</p>
                </div>
              </div>
            </div>

            {/* 本日のタスクサマリー */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#3E4D27] flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-[#748B47]"/> 本日のタスク
                </h3>
                <span className="text-xs bg-[#F2F5ED] text-[#5b7039] font-bold px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.completed).length} / {tasks.length} 完了
                </span>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-[#F9FAF6] rounded-2xl border border-[#EFEGE6]">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                          task.completed ? 'bg-[#5b7039] border-[#5b7039] text-white' : 'border-gray-300'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3"/>}
                      </button>
                      <span className={`text-xs font-bold ${task.completed ? 'line-through text-gray-400' : 'text-[#3E4D27]'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 font-bold text-gray-600">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================= INPUT TAB (収支・貯金入力) ================= */}
        {activeTab === 'input' && (
          <div className="bg-white p-6 rounded-3xl shadow-md border border-[#E8EDE0] space-y-5">
            <h2 className="text-lg font-black text-[#3E4D27] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#5b7039]"/> 収支・貯金の記録
            </h2>

            {/* 区分選択 */}
            <div className="grid grid-cols-4 gap-2">
              {(['消費', '浪費', '投資', '貯金'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setInputType(type)}
                  className={`py-2 text-xs font-black rounded-2xl transition-all ${
                    inputType === type 
                      ? type === '消費' ? 'bg-[#5b7039] text-white'
                      : type === '浪費' ? 'bg-[#F3A2B8] text-white'
                      : type === '投資' ? 'bg-[#F4C430] text-[#2C3527]'
                      : 'bg-[#4B7092] text-white'
                      : 'bg-[#F2F5ED] text-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* 金額入力 */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">金額 (円)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 font-black text-xl text-[#3E4D27]">¥</span>
                <input 
                  type="number"
                  placeholder="0"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="w-full bg-[#F8F9F5] pl-10 pr-4 py-3 rounded-2xl font-black text-2xl text-[#3E4D27] outline-none border border-[#E2E6D8] focus:border-[#5b7039]"
                />
              </div>
            </div>

            {/* 貯金目的選択（貯金の場合のみ） */}
            {inputType === '貯金' && (
              <div>
                <label className="text-xs font-bold text-[#4B7092] block mb-1">貯金の目的 (ポッド)</label>
                <select 
                  value={selectedSavingsGoal}
                  onChange={(e) => setSelectedSavingsGoal(e.target.value)}
                  className="w-full bg-[#F0F5FA] p-3 rounded-2xl font-bold text-xs text-[#2C3527] border border-[#D0E0F0] outline-none"
                >
                  {savingsGoals.map(goal => (
                    <option key={goal.id} value={goal.name}>{goal.name} (現在: ¥{goal.current.toLocaleString()})</option>
                  ))}
                </select>
              </div>
            )}

            {/* カテゴリー選択 ＆ カスタム追加 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-500">カテゴリー</label>
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[10px] font-bold text-[#5b7039] flex items-center gap-1 bg-[#F2F5ED] px-2 py-0.5 rounded-full"
                >
                  <Plus className="w-3 h-3"/> カテゴリーを追加
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-xs font-bold rounded-2xl transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#3E4D27] text-white shadow-sm' 
                        : 'bg-[#F2F5ED] text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* メモ */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">メモ</label>
              <input 
                type="text"
                placeholder="内容や店舗名など"
                value={inputMemo}
                onChange={(e) => setInputMemo(e.target.value)}
                className="w-full bg-[#F8F9F5] px-4 py-3 rounded-2xl text-xs font-bold outline-none border border-[#E2E6D8]"
              />
            </div>

            <button 
              onClick={handleRecordTransaction}
              className="w-full py-4 bg-[#5b7039] text-white rounded-2xl font-black text-sm shadow-lg hover:bg-[#4A5D2C] transition-all"
            >
              この内容で記録する
            </button>
          </div>
        )}

        {/* ================= SAVINGS TAB (目的別貯金) ================= */}
        {activeTab === 'savings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-[#3E4D27] flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#4B7092]"/> 目的別貯金・返済
              </h2>
              <button 
                onClick={() => setIsGoalModalOpen(true)}
                className="text-xs bg-[#5b7039] text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5"/> 新規目標
              </button>
            </div>

            {/* 全体達成率カード */}
            <div className="bg-gradient-to-r from-[#4B7092] to-[#2E4A63] text-white p-5 rounded-3xl shadow-md space-y-2">
              <p className="text-xs text-[#D0E0F0] font-bold">全体積立進捗</p>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-black">¥{totalSavingsCurrent.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#D0E0F0]">目標計: ¥{totalSavingsTarget.toLocaleString()}</p>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div style={{ width: `${totalSavingsProgress}%` }} className="h-full bg-[#F4C430]"></div>
              </div>
              <p className="text-right text-[10px] font-bold text-[#F4C430]">達成率 {totalSavingsProgress}%</p>
            </div>

            {/* 目標カード一覧 */}
            <div className="space-y-3">
              {savingsGoals.map(goal => {
                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100))
                const remaining = Math.max(0, goal.target - goal.current)

                return (
                  <div key={goal.id} className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-sm text-[#3E4D27]">{goal.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">目標日: {goal.targetDate}</p>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#F0F5FA] text-[#4B7092]">
                        {percent}% 完了
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500">現在: ¥{goal.current.toLocaleString()}</span>
                        <span className="text-gray-400">目標: ¥{goal.target.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#F2F5ED] rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="h-full bg-[#5b7039] rounded-full transition-all"></div>
                      </div>
                      <p className="text-[10px] text-right font-bold text-gray-400">
                        あと ¥{remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================= TASKS TAB (タスク ＆ カレンダー) ================= */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-[#3E4D27] flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#5b7039]"/> 事業・生活タスク
              </h2>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="text-xs bg-[#5b7039] text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5"/> タスク追加
              </button>
            </div>

            {/* 切替トグル */}
            <div className="bg-[#EFEGE6] p-1 rounded-2xl flex text-xs font-bold">
              <button 
                onClick={() => setTaskViewMode('list')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${taskViewMode === 'list' ? 'bg-white text-[#3E4D27] shadow-sm' : 'text-gray-500'}`}
              >
                リスト表示
              </button>
              <button 
                onClick={() => setTaskViewMode('calendar')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${taskViewMode === 'calendar' ? 'bg-white text-[#3E4D27] shadow-sm' : 'text-gray-500'}`}
              >
                カレンダー表示
              </button>
            </div>

            {/* リスト表示 */}
            {taskViewMode === 'list' && (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8EDE0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed ? 'bg-[#5b7039] border-[#5b7039] text-white' : 'border-gray-300'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5"/>}
                      </button>
                      <div>
                        <p className={`text-xs font-bold ${task.completed ? 'line-through text-gray-400' : 'text-[#3E4D27]'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span className="flex items-center gap-0.5"><CalendarIcon className="w-3 h-3"/> {task.dueDate}</span>
                          <span className="bg-[#F2F5ED] px-1.5 py-0.2 rounded text-[#5b7039] font-bold">{task.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* ゴミ箱で削除 */}
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* カレンダー表示 */}
            {taskViewMode === 'calendar' && (
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
                <p className="text-xs font-bold text-center text-[#3E4D27]">2026年 8月</p>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 border-b pb-2">
                  <span>日</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1
                    const dateStr = `2026-08-${day < 10 ? '0' + day : day}`
                    const hasTask = tasks.some(t => t.dueDate === dateStr)
                    return (
                      <div key={day} className={`p-2 rounded-xl flex flex-col items-center justify-center relative ${day === 11 ? 'bg-[#5b7039] text-white' : 'bg-[#F9FAF6]'}`}>
                        <span>{day}</span>
                        {hasTask && <span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] absolute bottom-1"></span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= AI TAB (AI顧問 抹茶さん) ================= */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#3E4D27] to-[#5b7039] text-white p-6 rounded-3xl shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                  🍵
                </div>
                <div>
                  <h3 className="font-black text-base">専属AI顧問 抹茶さん</h3>
                  <p className="text-[10px] text-[#D1DCB8] font-bold">経営診断ランク: A (極めて順調)</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[#F8F9F5] bg-black/10 p-3 rounded-2xl">
                「いぶき経営者さん、今月は投資比率30%を達成できており、自己投資と資産形成のバランスが非常に優秀です！」
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
              <h4 className="text-xs font-black text-[#3E4D27] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#F4C430]"/> 抹茶AIからの経営改善提案
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F2F5ED] rounded-2xl border-l-4 border-[#5b7039]">
                  <p className="font-bold text-[#3E4D27]">1. 奨学金返済の加速アドバイス</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">浪費額をあと¥10,000抑えて繰り上げ返済に回すと、完済目標が3ヶ月早まります。</p>
                </div>
                <div className="p-3 bg-[#FAF0F3] rounded-2xl border-l-4 border-[#F3A2B8]">
                  <p className="font-bold text-[#B84061]">2. 固定費の定期レビュー</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">サブスクリプション利用状況のチェックタスクを来週追加しましょう。</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── カテゴリー追加 モーダル ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">新しいカテゴリーを追加</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <input 
              type="text"
              placeholder="例: サブスク、ペット代"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
            />
            <button 
              onClick={handleAddCategory}
              className="w-full py-3 bg-[#5b7039] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              追加する
            </button>
          </div>
        </div>
      )}

      {/* ── 貯金目標追加 モーダル ── */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">新しい貯金目標を追加</h3>
              <button onClick={() => setIsGoalModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <input 
              type="text"
              placeholder="目標名 (例: 車の買い替え)"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
            />
            <input 
              type="number"
              placeholder="目標金額 (円)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
            />
            <input 
              type="date"
              value={newGoalDate}
              onChange={(e) => setNewGoalDate(e.target.value)}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none text-gray-600"
            />
            <button 
              onClick={handleAddSavingsGoal}
              className="w-full py-3 bg-[#4B7092] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              目標を作成する
            </button>
          </div>
        </div>
      )}

      {/* ── タスク追加 モーダル ── */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">タスクを追加</h3>
              <button onClick={() => setIsTaskModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <input 
              type="text"
              placeholder="タスク内容"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
            />
            <div className="flex gap-2">
              <select 
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-1/2 p-2.5 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8]"
              >
                <option value="お金">お金</option>
                <option value="仕事・キャリア">仕事</option>
                <option value="健康・生活">健康</option>
                <option value="自己投資">自己投資</option>
              </select>
              <select 
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-1/2 p-2.5 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8]"
              >
                <option value="高">優先度: 高</option>
                <option value="中">優先度: 中</option>
                <option value="低">優先度: 低</option>
              </select>
            </div>
            <input 
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none text-gray-600"
            />
            <button 
              onClick={handleAddTask}
              className="w-full py-3 bg-[#5b7039] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              タスクを追加する
            </button>
          </div>
        </div>
      )}

      {/* ── ボトムナビゲーションバー ── */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-[#E8EDE0] p-3 flex justify-around items-center z-40 rounded-t-3xl shadow-lg">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-[#5b7039] font-black scale-105' : 'text-gray-400 font-bold'}`}
        >
          <Home className="w-5 h-5"/>
          <span className="text-[10px]">ホーム</span>
        </button>

        <button 
          onClick={() => setActiveTab('input')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'input' ? 'text-[#5b7039] font-black scale-105' : 'text-gray-400 font-bold'}`}
        >
          <PlusCircle className="w-5 h-5"/>
          <span className="text-[10px]">収支入力</span>
        </button>

        <button 
          onClick={() => setActiveTab('savings')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'savings' ? 'text-[#4B7092] font-black scale-105' : 'text-gray-400 font-bold'}`}
        >
          <PiggyBank className="w-5 h-5"/>
          <span className="text-[10px]">貯金</span>
        </button>

        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'tasks' ? 'text-[#5b7039] font-black scale-105' : 'text-gray-400 font-bold'}`}
        >
          <CheckSquare className="w-5 h-5"/>
          <span className="text-[10px]">タスク</span>
        </button>

        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'ai' ? 'text-[#5b7039] font-black scale-105' : 'text-gray-400 font-bold'}`}
        >
          <Bot className="w-5 h-5"/>
          <span className="text-[10px]">AI顧問</span>
        </button>
      </nav>

    </div>
  )
}