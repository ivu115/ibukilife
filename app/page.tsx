'use client'

import React, { useState, useEffect } from 'react'
import { 
  Home, PlusCircle, CheckSquare, Bot, PiggyBank, Plus, Trash2, Edit3, Calendar as CalendarIcon, 
  TrendingUp, Wallet, Check, X, Sparkles, Tag, Send, Loader2, GraduationCap
} from 'lucide-react'

export default function LifeOSDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'input' | 'savings' | 'tasks' | 'ai'>('home')
  const [isLoaded, setIsLoaded] = useState(false)

  // --- BS (純資産・資産・負債・奨学金別枠) ---
  const [bsData, setBsData] = useState({ assets: 0, liabilities: 0, scholarship: 0 })
  const [isBsModalOpen, setIsBsModalOpen] = useState(false)
  const [bsForm, setBsForm] = useState({ assets: '0', liabilities: '0', scholarship: '0' })

  // --- PL (今月の収支) ---
  const [plData, setPlData] = useState({ consumption: 0, waste: 0, investment: 0, savings: 0 })

  // --- カテゴリー ---
  const [categories, setCategories] = useState<string[]>([
    '食費', '日用品', '交際費', '固定費', '自己投資', '趣味・娯楽'
  ])
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  // --- 目的別貯金 ---
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: '奨学金返済用ポッド', target: 1000000, current: 0, targetDate: '2028-03-31' },
  ])
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any | null>(null)
  const [goalForm, setGoalForm] = useState({ name: '', target: '', current: '0', targetDate: '' })

  // --- タスク ---
  const [tasks, setTasks] = useState([
    { id: 1, title: '初日の収支を記録する', category: 'お金', priority: '高', dueDate: new Date().toISOString().split('T')[0], completed: false },
  ])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any | null>(null)
  const [taskForm, setTaskForm] = useState({ title: '', category: 'お金', priority: '中', dueDate: new Date().toISOString().split('T')[0] })
  const [taskViewMode, setTaskViewMode] = useState<'list' | 'calendar'>('list')

  // --- AIチャットState ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: 'おかえりなさい！いぶき経営者さん。今日の財務状況や目標、タスクについて何でも相談してくださいね！🍵' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // --- 収支入力State ---
  const [inputAmount, setInputAmount] = useState('')
  const [inputType, setInputType] = useState<'消費' | '浪費' | '投資' | '貯金'>('消費')
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '食費')
  const [selectedSavingsGoal, setSelectedSavingsGoal] = useState(savingsGoals[0]?.name || '')
  const [inputMemo, setInputMemo] = useState('')

  // ================= 💾 自動保存・自動復元 (localStorage) =================
  // 初回起動時：スマホ保存領域からデータを復元
  useEffect(() => {
    try {
      const savedBs = localStorage.getItem('ibuki_bsData')
      if (savedBs) setBsData(JSON.parse(savedBs))

      const savedPl = localStorage.getItem('ibuki_plData')
      if (savedPl) setPlData(JSON.parse(savedPl))

      const savedCat = localStorage.getItem('ibuki_categories')
      if (savedCat) setCategories(JSON.parse(savedCat))

      const savedGoals = localStorage.getItem('ibuki_savingsGoals')
      if (savedGoals) setSavingsGoals(JSON.parse(savedGoals))

      const savedTasks = localStorage.getItem('ibuki_tasks')
      if (savedTasks) setTasks(JSON.parse(savedTasks))
    } catch (e) {
      console.error('Failed to load from localStorage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // 変更検知時：自動保存
  useEffect(() => {
    if (isLoaded) localStorage.setItem('ibuki_bsData', JSON.stringify(bsData))
  }, [bsData, isLoaded])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('ibuki_plData', JSON.stringify(plData))
  }, [plData, isLoaded])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('ibuki_categories', JSON.stringify(categories))
  }, [categories, isLoaded])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('ibuki_savingsGoals', JSON.stringify(savingsGoals))
  }, [savingsGoals, isLoaded])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('ibuki_tasks', JSON.stringify(tasks))
  }, [tasks, isLoaded])

  // ----------------【BS操作】----------------
  const handleSaveBs = () => {
    setBsData({
      assets: Number(bsForm.assets || 0),
      liabilities: Number(bsForm.liabilities || 0),
      scholarship: Number(bsForm.scholarship || 0),
    })
    setIsBsModalOpen(false)
  }

  // ----------------【カテゴリー操作】----------------
  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return
    if (!categories.includes(newCategoryInput.trim())) {
      setCategories([...categories, newCategoryInput.trim()])
      setSelectedCategory(newCategoryInput.trim())
    }
    setNewCategoryInput('')
  }

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) return alert('カテゴリーは最低1つ必要です。')
    setCategories(categories.filter(c => c !== catToDelete))
    if (selectedCategory === catToDelete) setSelectedCategory(categories[0])
  }

  // ----------------【貯金目標操作】----------------
  const handleOpenGoalModal = (goalToEdit?: any) => {
    if (goalToEdit) {
      setEditingGoal(goalToEdit)
      setGoalForm({
        name: goalToEdit.name,
        target: String(goalToEdit.target),
        current: String(goalToEdit.current),
        targetDate: goalToEdit.targetDate,
      })
    } else {
      setEditingGoal(null)
      setGoalForm({ name: '', target: '', current: '0', targetDate: '' })
    }
    setIsGoalModalOpen(true)
  }

  const handleSaveGoal = () => {
    if (!goalForm.name || !goalForm.target) return
    if (editingGoal) {
      setSavingsGoals(savingsGoals.map(g => g.id === editingGoal.id ? {
        ...g,
        name: goalForm.name,
        target: Number(goalForm.target),
        current: Number(goalForm.current),
        targetDate: goalForm.targetDate || '2027-12-31'
      } : g))
    } else {
      const newGoal = {
        id: Date.now(),
        name: goalForm.name,
        target: Number(goalForm.target),
        current: Number(goalForm.current || 0),
        targetDate: goalForm.targetDate || '2027-12-31',
      }
      setSavingsGoals([...savingsGoals, newGoal])
    }
    setIsGoalModalOpen(false)
  }

  const handleDeleteGoal = (id: number) => {
    if (confirm('この貯金目標を削除しますか？')) {
      setSavingsGoals(savingsGoals.filter(g => g.id !== id))
    }
  }

  // ----------------【タスク操作】----------------
  const handleOpenTaskModal = (taskToEdit?: any) => {
    if (taskToEdit) {
      setEditingTask(taskToEdit)
      setTaskForm({
        title: taskToEdit.title,
        category: taskToEdit.category,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate,
      })
    } else {
      setEditingTask(null)
      setTaskForm({ title: '', category: 'お金', priority: '中', dueDate: new Date().toISOString().split('T')[0] })
    }
    setIsTaskModalOpen(true)
  }

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) return
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t))
    } else {
      const newTask = { id: Date.now(), ...taskForm, completed: false }
      setTasks([...tasks, newTask])
    }
    setIsTaskModalOpen(false)
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  // ----------------【AIチャット送信】----------------
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return
    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')
    setIsAiLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: {
            netWorth,
            assets: bsData.assets,
            liabilities: bsData.liabilities,
            scholarship: bsData.scholarship,
            totalExpense,
            consumption: plData.consumption,
            waste: plData.waste,
            investment: plData.investment,
          }
        })
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }])
    } catch {
      setChatMessages(prev => [...prev, { sender: 'ai', text: '通信エラーが発生しました。もう一度送信してください！' }])
    } finally {
      setIsAiLoading(false)
    }
  }

  // 収支記録送信
  const handleRecordTransaction = async () => {
    if (!inputAmount) return
    const amount = Number(inputAmount)

    if (inputType === '消費') setPlData(prev => ({ ...prev, consumption: prev.consumption + amount }))
    if (inputType === '浪費') setPlData(prev => ({ ...prev, waste: prev.waste + amount }))
    if (inputType === '投資') setPlData(prev => ({ ...prev, investment: prev.investment + amount }))
    
    if (inputType === '貯金') {
      setPlData(prev => ({ ...prev, savings: prev.savings + amount }))
      if (selectedSavingsGoal) {
        setSavingsGoals(savingsGoals.map(g => g.name === selectedSavingsGoal ? { ...g, current: g.current + amount } : g))
      }
      setBsData(prev => ({ ...prev, assets: prev.assets + amount }))
    } else {
      setBsData(prev => ({ ...prev, assets: Math.max(0, prev.assets - amount) }))
    }

    try {
      await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addTransaction',
          data: {
            type: inputType,
            amount: amount,
            category: selectedCategory,
            savingsGoal: inputType === '貯金' ? selectedSavingsGoal : '',
            memo: inputMemo,
            date: new Date().toISOString().split('T')[0]
          }
        })
      })
      alert(`【${inputType}】¥${amount.toLocaleString()} を記録し、スプレッドシートに保存しました！`)
    } catch (e) {
      alert(`【${inputType}】¥${amount.toLocaleString()} を記録しました`)
    }

    setInputAmount('')
    setInputMemo('')
    setActiveTab('home')
  }

  // 動的計算プロパティ
  const totalExpense = plData.consumption + plData.waste + plData.investment
  const consumptionRatio = totalExpense > 0 ? Math.round((plData.consumption / totalExpense) * 100) : 0
  const wasteRatio = totalExpense > 0 ? Math.round((plData.waste / totalExpense) * 100) : 0
  const investmentRatio = totalExpense > 0 ? Math.round((plData.investment / totalExpense) * 100) : 0

  const netWorth = bsData.assets - bsData.liabilities

  const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0)
  const totalSavingsCurrent = savingsGoals.reduce((sum, g) => sum + g.current, 0)
  const totalSavingsProgress = totalSavingsTarget > 0 ? Math.round((totalSavingsCurrent / totalSavingsTarget) * 100) : 0

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
        <div className="w-10 h-10 rounded-full bg-[#5b7039] text-white flex items-center justify-center text-xl shadow-md border-2 border-white/20">
          🍵
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
                <span className="flex items-center gap-1"><Wallet className="w-4 h-4"/> 日常純資産 (BS)</span>
                <button 
                  onClick={() => {
                    setBsForm({ assets: String(bsData.assets), liabilities: String(bsData.liabilities), scholarship: String(bsData.scholarship) })
                    setIsBsModalOpen(true)
                  }}
                  className="bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] hover:bg-white/30 transition-all flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3"/> 初期資産を設定
                </button>
              </div>
              <div>
                <p className="text-xs text-[#D1DCB8]">現在の日常純資産 (奨学金除く)</p>
                <p className="text-3xl font-black tracking-tight">¥{netWorth.toLocaleString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm">
                  <p className="text-[#D1DCB8] text-[10px]">総資産 (現金・口座)</p>
                  <p className="font-bold text-sm">¥{bsData.assets.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm">
                  <p className="text-[#D1DCB8] text-[10px]">日常の負債 (クレカ等)</p>
                  <p className="font-bold text-sm">¥{bsData.liabilities.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#F4C430]"/>
                  <div>
                    <p className="font-bold text-[11px] text-white">奨学金 (学生期間・別枠管理)</p>
                    <p className="text-[9px] text-[#D1DCB8]">※純資産マイナス計算から除外中</p>
                  </div>
                </div>
                <p className="font-black text-sm text-[#F4C430]">¥{bsData.scholarship.toLocaleString()}</p>
              </div>
            </div>

            {/* PL 今月の収支 */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#3E4D27] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-[#748B47]"/> 今月の収支 (PL)
                </h3>
                <span className="text-xs text-gray-500 font-bold">支出 ¥{totalExpense.toLocaleString()}</span>
              </div>

              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${consumptionRatio}%` }} className="bg-[#5b7039]"></div>
                <div style={{ width: `${wasteRatio}%` }} className="bg-[#F3A2B8]"></div>
                <div style={{ width: `${investmentRatio}%` }} className="bg-[#F4C430]"></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-[#F2F5ED] p-2.5 rounded-2xl">
                  <p className="text-[10px] text-gray-600 font-bold flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#5b7039]"></span>消費
                  </p>
                  <p className="font-black text-sm text-[#3E4D27]">{consumptionRatio}%</p>
                  <p className="text-[9px] text-gray-400">¥{plData.consumption.toLocaleString()}</p>
                </div>
                <div className="bg-[#FAF0F3] p-2.5 rounded-2xl">
                  <p className="text-[10px] text-gray-600 font-bold flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#F3A2B8]"></span>浪費
                  </p>
                  <p className="font-black text-sm text-[#B84061]">{wasteRatio}%</p>
                  <p className="text-[9px] text-gray-400">¥{plData.waste.toLocaleString()}</p>
                </div>
                <div className="bg-[#FAF6E6] p-2.5 rounded-2xl">
                  <p className="text-[10px] text-gray-600 font-bold flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#F4C430]"></span>投資
                  </p>
                  <p className="font-black text-sm text-[#927110]">{investmentRatio}%</p>
                  <p className="text-[9px] text-gray-400">¥{plData.investment.toLocaleString()}</p>
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
                {tasks.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">タスクはありません</p>
                ) : (
                  tasks.slice(0, 3).map(task => (
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
                  ))
                )}
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-500">カテゴリー</label>
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[10px] font-bold text-[#5b7039] flex items-center gap-1 bg-[#F2F5ED] px-2 py-0.5 rounded-full"
                >
                  <Tag className="w-3 h-3"/> カテゴリー編集・追加
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
                onClick={() => handleOpenGoalModal()}
                className="text-xs bg-[#5b7039] text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5"/> 新規目標
              </button>
            </div>

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

            <div className="space-y-3">
              {savingsGoals.map(goal => {
                const percent = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0
                const remaining = Math.max(0, goal.target - goal.current)

                return (
                  <div key={goal.id} className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8EDE0] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-sm text-[#3E4D27]">{goal.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">目標日: {goal.targetDate}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleOpenGoalModal(goal)}
                          className="p-1.5 bg-[#F2F5ED] text-[#5b7039] rounded-xl hover:bg-[#E2E6D8] transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5"/>
                        </button>
                        <button 
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 bg-[#FAF0F3] text-[#B84061] rounded-xl hover:bg-[#F3A2B8]/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#4B7092]">現在: ¥{goal.current.toLocaleString()}</span>
                        <span className="text-gray-400">目標: ¥{goal.target.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#F2F5ED] rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="h-full bg-[#5b7039] rounded-full transition-all"></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-[#5b7039]">{percent}% 達成</span>
                        <span className="text-gray-400">あと ¥{remaining.toLocaleString()}</span>
                      </div>
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
                onClick={() => handleOpenTaskModal()}
                className="text-xs bg-[#5b7039] text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5"/> タスク追加
              </button>
            </div>

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

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenTaskModal(task)}
                        className="text-gray-300 hover:text-[#5b7039] p-1 transition-colors"
                      >
                        <Edit3 className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

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

        {/* ================= AI TAB (対話型 AI顧問 抹茶さん) ================= */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#3E4D27] to-[#5b7039] text-white p-5 rounded-3xl shadow-lg space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-inner border border-white/30">
                  🍵
                </div>
                <div>
                  <h3 className="font-black text-base flex items-center gap-1">
                    専属AI顧問 抹茶さん <Sparkles className="w-4 h-4 text-[#F4C430]"/>
                  </h3>
                  <p className="text-[10px] text-[#D1DCB8] font-bold">いつでも財務・生活経営のご相談をどうぞ</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#E8EDE0] space-y-3 min-h-[320px] flex flex-col justify-between">
              <div className="space-y-3 overflow-y-auto max-h-[300px] p-1">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-[#5b7039] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        🍵
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-xs font-bold max-w-[80%] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#5b7039] text-white rounded-br-none shadow-sm' 
                        : 'bg-[#F2F5ED] text-[#2C3527] rounded-bl-none border border-[#E2E6D8]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex gap-2 items-center text-xs text-gray-400 font-bold p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#5b7039]"/> 抹茶さんが考え中...
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <input 
                  type="text"
                  placeholder="今月の節約アドバイスをちょうだい..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 bg-[#F8F9F5] px-4 py-3 rounded-2xl text-xs font-bold outline-none border border-[#E2E6D8]"
                />
                <button 
                  onClick={handleSendChatMessage}
                  disabled={isAiLoading}
                  className="bg-[#5b7039] text-white p-3 rounded-2xl hover:bg-[#4A5D2C] transition-all shadow-md shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── BS (資産・負債・奨学金別枠) 設定 モーダル ── */}
      {isBsModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">初期資産・負債の設定</h3>
              <button onClick={() => setIsBsModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">現在の総資産 (銀行口座・現金など)</label>
              <input 
                type="number"
                placeholder="0"
                value={bsForm.assets}
                onChange={(e) => setBsForm({ ...bsForm, assets: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">日常の負債 (クレカ未払金等)</label>
              <input 
                type="number"
                placeholder="0"
                value={bsForm.liabilities}
                onChange={(e) => setBsForm({ ...bsForm, liabilities: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#4B7092] flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5"/> 奨学金 (学生期間・別枠管理)
              </label>
              <p className="text-[9px] text-gray-400 mb-1">※日常純資産のマイナス計算から除外されます</p>
              <input 
                type="number"
                placeholder="0"
                value={bsForm.scholarship}
                onChange={(e) => setBsForm({ ...bsForm, scholarship: e.target.value })}
                className="w-full p-3 bg-[#F0F5FA] rounded-2xl text-xs font-bold border border-[#D0E0F0] outline-none text-[#2C3527]"
              />
            </div>
            <button 
              onClick={handleSaveBs}
              className="w-full py-3 bg-[#5b7039] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              設定を反映する
            </button>
          </div>
        </div>
      )}

      {/* ── カテゴリー編集・追加 モーダル ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">カテゴリー管理</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="新しいカテゴリー"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="w-full p-2.5 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
              />
              <button 
                onClick={handleAddCategory}
                className="px-4 bg-[#5b7039] text-white font-bold text-xs rounded-2xl shrink-0"
              >
                追加
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <p className="text-[10px] font-bold text-gray-400">現在のカテゴリー (タップで削除)</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <span 
                    key={cat} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2F5ED] text-xs font-bold text-[#3E4D27] rounded-xl"
                  >
                    {cat}
                    <button onClick={() => handleDeleteCategory(cat)} className="text-gray-400 hover:text-red-500">
                      <X className="w-3 h-3"/>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 貯金目標（新規・編集） モーダル ── */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">
                {editingGoal ? '貯金目標の編集' : '新規貯金目標を追加'}
              </h3>
              <button onClick={() => setIsGoalModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">目標名</label>
              <input 
                type="text"
                placeholder="例: 車の買い替え"
                value={goalForm.name}
                onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">目標金額 (円)</label>
              <input 
                type="number"
                placeholder="目標金額"
                value={goalForm.target}
                onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">現在の蓄積額 (円)</label>
              <input 
                type="number"
                placeholder="現在の貯蓄額"
                value={goalForm.current}
                onChange={(e) => setGoalForm({ ...goalForm, current: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">目標達成日</label>
              <input 
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none text-gray-600"
              />
            </div>
            <button 
              onClick={handleSaveGoal}
              className="w-full py-3 bg-[#4B7092] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              {editingGoal ? '変更を保存する' : '目標を作成する'}
            </button>
          </div>
        </div>
      )}

      {/* ── タスク（新規・編集） モーダル ── */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#3E4D27]">
                {editingTask ? 'タスクの編集' : 'タスクを追加'}
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
            </div>
            <input 
              type="text"
              placeholder="タスク内容"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none"
            />
            <div className="flex gap-2">
              <select 
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                className="w-1/2 p-2.5 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8]"
              >
                <option value="お金">お金</option>
                <option value="仕事・キャリア">仕事</option>
                <option value="健康・生活">健康</option>
                <option value="自己投資">自己投資</option>
              </select>
              <select 
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-1/2 p-2.5 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8]"
              >
                <option value="高">優先度: 高</option>
                <option value="中">優先度: 中</option>
                <option value="低">優先度: 低</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400">期限日</label>
              <input 
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full p-3 bg-[#F8F9F5] rounded-2xl text-xs font-bold border border-[#E2E6D8] outline-none text-gray-600"
              />
            </div>
            <button 
              onClick={handleSaveTask}
              className="w-full py-3 bg-[#5b7039] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              {editingTask ? '変更を保存する' : 'タスクを追加する'}
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