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
  LogOut,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMeQuery } from '@/lib/queries/auth/queries';
import { useLogoutMutation } from '@/lib/queries/auth/mutations';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    management: true,
    service: true
  });

  const { data: userInfo, isLoading: isLoadingUser } = useMeQuery();
  const logoutMutation = useLogoutMutation();

  // 모바일 메뉴가 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logoutMutation.mutate();
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

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="h-16 flex flex-col justify-center px-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-base font-semibold text-black">관리 페이지</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg transition-colors lg:block hidden"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-6 h-6 text-[#767676]" />
            ) : (
              <PanelLeftClose className="w-6 h-6 text-[#767676]" />
            )}
          </button>
          {/* 모바일 닫기 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg transition-colors lg:hidden"
          >
            <CloseIcon className="w-6 h-6 text-[#767676]" />
          </button>
        </div>

        <div className="mt-3 border-t border-[#EBEBEB] w-full" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mb-4">
          <button
            onClick={() => toggleSection('management')}
            className="w-full px-4 py-2 flex items-center transition-colors"
          >
            {!isCollapsed && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#767676] font-medium">관리</span>
                {expandedSections.management ? (
                  <ChevronDown className="w-5 h-5 text-[#767676]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#767676]" />
                )}
              </div>
            )}
          </button>
          
          {expandedSections.management && (
            <div className="mt-1 px-2 flex flex-col gap-1">
              {managementItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={`flex items-center transition-colors group rounded-[12px] ${
                      isCollapsed 
                        ? 'justify-center p-[10px]'
                        : 'p-[15px]'
                    } ${
                      isActive ? 'bg-[#EDEDED]' : 'hover:bg-[#EDEDED]'
                    }`}
                  >
                    <item.icon className="w-6 h-6 text-[#505050] flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 text-base text-[#505050]">{item.label}</span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('service')}
            className="w-full px-4 py-2 flex items-center transition-colors"
          >
            {!isCollapsed && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#767676] font-medium">서비스</span>
                {expandedSections.service ? (
                  <ChevronDown className="w-5 h-5 text-[#767676]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#767676]" />
                )}
              </div>
            )}
          </button>
          
          {expandedSections.service && (
            <div className="mt-1 px-2 flex flex-col gap-1">
              {serviceItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={`flex items-center px-[15px] py-[15px] transition-colors group rounded-[12px] ${
                      isActive ? 'bg-[#EDEDED]' : 'hover:bg-[#EDEDED]'
                    }`}
                  >
                    <item.icon className="w-6 h-6 text-[#505050] flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 text-base text-[#505050]">{item.label}</span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 flex flex-col">
        <div className="mb-3 border-t border-gray-200 w-full self-center" />
        {isLoadingUser ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray rounded-full animate-pulse flex-shrink-0" />
            {!isCollapsed && (
              <div className="ml-3 h-4 bg-gray rounded w-24 animate-pulse" />
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
                <div className="w-8 h-8 bg-gray rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              {!isCollapsed && (
                <span className="ml-3 text-sm text-black font-medium truncate">
                  {userInfo.name}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  logoutMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <LogOut className="w-6 h-6 text-gray" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-gray rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-sm text-black font-medium truncate">
                  로그인 필요
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-md transition-colors"
      >
        <Menu className="w-6 h-6 text-gray" />
      </button>

      {/* 데스크톱 사이드바 */}
      <div 
        className={`hidden lg:flex h-full bg-white border-r-2 border-[#EEEEEE] flex-col transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-72'
        }`}
      >
        <SidebarContent />
      </div>

      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 모바일 사이드바 */}
      <div 
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;