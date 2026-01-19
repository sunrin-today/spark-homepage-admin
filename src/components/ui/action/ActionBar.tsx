import React from 'react';

export interface ActionBarItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  backgroundColor?: string;
  iconColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
}

interface ActionBarProps {
  title: string;
  items: ActionBarItem[];
}

const ActionBar: React.FC<ActionBarProps> = ({ title, items }) => {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#DEDEDE] overflow-hidden bg-white shadow-sm">
      {/* 제목 */}
      <div className="px-6 py-4 bg-white border-b border-[#DEDEDE]">
        <h3 className="text-lg font-normal text-[#767676]">{title}</h3>
      </div>

      {/* 액션 아이템 */}
      <div className="divide-y divide-[#DEDEDE]">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            style={{
              backgroundColor: item.backgroundColor || '#FFFFFF',
            }}
            onMouseEnter={(e) => {
              if (item.hoverBackgroundColor) {
                e.currentTarget.style.backgroundColor = item.hoverBackgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = item.backgroundColor || '#FFFFFF';
            }}
            className="w-full px-6 py-5 flex items-center gap-4 transition-colors"
          >
            <span
              style={{
                color: item.iconColor || '#4A4A4A',
              }}
            >
              {item.icon}
            </span>
            <span
              className="text-xl font-normal"
              style={{
                color: item.textColor || '#000000',
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionBar;


// 사용 예시 

// import { Edit } from 'lucide-react';
// const actionItems: ActionBarItem[] = [
//   {
//     icon: <Edit size={24} />,
//     label: '수정',
//     backgroundColor: '#F9F9F9',
//     iconColor: '#FDC019',
//     textColor: '#000000',
//     onClick: () => console.log('수정'),
//   },
// ];
// <ActionBar title="액션" items={actionItems} />
