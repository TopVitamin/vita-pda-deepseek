import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleLogin = async () => {
    setError('');
    if (!username.trim()) { setError('请输入账号'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/select-warehouse', { replace: true });
      } else {
        setError(result.message);
      }
    } catch {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🏭</div>
        <h1 className="text-2xl font-bold text-gray-800">维他仓库PDA</h1>
        <p className="text-gray-500 mt-1 text-base">仓库手持终端系统</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">账号</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入手机号或用户名"
            className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-base">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">记住账号</span>
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg active:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? '登录中...' : '登 录'}
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-500 text-center mb-2">测试账号</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
          <span>admin / 123456</span>
          <span>picker / 123456</span>
          <span>receiver / 123456</span>
          <span>checker / 123456</span>
          <span>packer / 123456</span>
        </div>
      </div>
    </div>
  );
}
