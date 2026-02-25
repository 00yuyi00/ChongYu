import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('请输入正确的邮箱格式');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('请先阅读并同意相关协议');
      return;
    }
    if (!validateEmail()) return;
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (!password) {
      alert('请输入密码');
      return;
    }

    setIsSubmitting(true);
    try {
      // Supabase 真实注册
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0],
            avatar_url: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
          }
        }
      });

      if (error) {
        alert('注册遇到问题: ' + error.message);
        return;
      }

      alert('注册成功，已自动登录！');
      navigate('/');
    } catch (err: any) {
      alert('注册过程遭遇崩溃: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }

    alert('注册成功！');
    navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('请先阅读并同意相关协议');
      return;
    }
    if (!email || !password) {
      alert('请输入账号和密码');
      return;
    }

    setIsSubmitting(true);
    try {
      // Supabase 真实登录
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert('登录失败: 用户名或密码错误 (' + error.message + ')');
        return;
      }

      if (!data.session) {
        alert('网络似乎被阻断，未正常获取到登录凭证。');
        return;
      }

      navigate('/');
    } catch (err: any) {
      alert('登录过程出错: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto relative min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-start antialiased px-8 pt-12">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-8">
        {/* Placeholder for layout balance if needed, or back button */}
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="bg-amber-500 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
          <PawPrint className="text-white w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white mb-1">宠遇</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">遇见最好的TA</p>
      </div>

      <div className="flex w-full mb-8 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 pb-3 text-lg font-medium transition-colors ${activeTab === 'login' ? 'text-amber-500 border-b-2 border-amber-500 font-bold' : 'text-zinc-400 dark:text-zinc-500'}`}
        >
          登录
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 pb-3 text-lg font-medium transition-colors ${activeTab === 'register' ? 'text-amber-500 border-b-2 border-amber-500 font-bold' : 'text-zinc-400 dark:text-zinc-500'}`}
        >
          注册
        </button>
      </div>

      <div className="w-full space-y-5">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            placeholder="邮箱地址"
            className={`w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-amber-500/50 text-base placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 ${emailError ? 'ring-2 ring-red-500/50' : ''}`}
          />
          {emailError && <p className="text-red-500 text-xs mt-1 ml-1 absolute -bottom-5 left-0">{emailError}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码"
            className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-amber-500/50 text-base placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {activeTab === 'register' && (
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="确认密码"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-amber-500/50 text-base placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="flex justify-end">
            <button type="button" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-amber-500">
              忘记密码？
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2 px-1">
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-500 cursor-pointer bg-white dark:bg-zinc-800"
          />
          <label htmlFor="agreement" className="text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
            同意<span className="text-amber-500 underline cursor-pointer">《用户协议》</span>与<span className="text-amber-500 underline cursor-pointer">《隐私政策》</span>
          </label>
        </div>

        <div className="pt-4">
          <button
            disabled={isSubmitting}
            onClick={activeTab === 'login' ? handleLogin : handleRegister}
            className={`w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98] text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? '处理中...' : (activeTab === 'login' ? '立即登录' : '注册账号')}
          </button>
        </div>
      </div>
    </div>
  );
}
