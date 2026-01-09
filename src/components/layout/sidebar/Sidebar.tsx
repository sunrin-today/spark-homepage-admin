"use client";

import React, { useState } from 'react';
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

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    management: true,
    service: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-800">관리 페이지</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-gray-600" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-gray-600" />
          )}
        </button>
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
                <span className="text-sm text-gray-600 font-medium">관리</span>
                {expandedSections.management ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
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
                  <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm text-gray-700">{item.label}</span>
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
                <span className="text-sm text-gray-600 font-medium">서비스</span>
                {expandedSections.service ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
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
                  <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm text-gray-700">{item.label}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-sm text-gray-700 font-medium truncate">
                10418 정우진
              </span>
            )}
          </div>
          {!isCollapsed && (
            <button className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default Sidebar;