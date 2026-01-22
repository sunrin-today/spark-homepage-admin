"use client";

import React, { useState, useEffect } from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  Megaphone,
  User,
  CalendarDays,
  PartyPopper,
  Box,
  Zap,
  Proportions,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContexts';
import { getUserInfo } from '@/lib/api/users';
import type { UserResponse } from '@/lib/types/users';
import Image from 'next/image';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    management: true,
    service: true
  });
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setIsLoadingUser(false);
        return;
      }

      try {
        setIsLoadingUser(true);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const managementItems = [
    { icon: Megaphone, label: '공지사항', href: '/notice' },
    { icon: User, label: '사용자', href: '/users' },
    { icon: CalendarDays, label: '일정', href: '/schedule' },
    { icon: PartyPopper, label: '이벤트', href: '/events' }
  ];

  const serviceItems = [
    { icon: Box, label: '월간 분실물', href: '/losts' },
    { icon: Zap, label: '충전기 대여', href: '/charger' },
    { icon: Proportions, label: '소회의실 대여', href: '/meeting-room' }
  ];

  return (
    <div 
      className={`h-full bg-white border-r-2 border-[#EEEEEE] flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex flex-col justify-center px-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-base font-semibold text-black">관리 페이지</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-6 h-6 text-[#767676]" />
            ) : (
              <PanelLeftClose className="w-6 h-6 text-[#767676]" />
            )}
          </button>
        </div>

        <div className="mt-3 h-px w-[268px] bg-[#EBEBEB] self-center" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mb-4">
          <button
            onClick={() => toggleSection('management')}
            className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            {!isCollapsed && (
              <>
                <span className="text-sm text-[#767676] font-medium">관리</span>
                {expandedSections.management ? (
                  <ChevronDown className="w-5 h-5 text-[#767676]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#767676]" />
                )}
              </>
            )}
            {isCollapsed && <div className="w-full h-px bg-gray-200" />}
          </button>
          
          {expandedSections.management && (
            <div className="mt-1">
              {managementItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-[#505050] flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-base text-[#505050]">{item.label}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('service')}
            className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            {!isCollapsed && (
              <>
                <span className="text-sm text-[#767676] font-medium">서비스</span>
                {expandedSections.service ? (
                  <ChevronDown className="w-5 h-5 text-[#767676]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#767676]" />
                )}
              </>
            )}
            {isCollapsed && <div className="w-full h-px bg-gray-200" />}
          </button>
          
          {expandedSections.service && (
            <div className="mt-1">
              {serviceItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-[#505050] flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-base text-[#505050]">{item.label}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 flex flex-col">
        <div className="mb-3 h-px w-[268px] bg-[#EBEBEB] self-center" />
        {isLoadingUser ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
            {!isCollapsed && (
              <div className="ml-3 h-4 bg-gray-200 rounded w-24 animate-pulse" />
            )}
          </div>
        ) : userInfo ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              {userInfo.avatarUrl ? (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={userInfo.avatarUrl}
                    alt={userInfo.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              {!isCollapsed && (
                <span className="ml-3 text-sm text-gray-700 font-medium truncate">
                  {userInfo.name}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              >
                <LogOut className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-sm text-gray-700 font-medium truncate">
                  로그인 필요
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;