"use client";
import { SearchBar } from "@/components/common/search/SearchBar";
import { useState } from "react";

export default function MeetingRoomPage() {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearch = (value: string) => {
    // TODO: 검색 로직 구현
    console.log(value);
  };
  
  return (
    <div className="px-4 py-8">
      <h1 className="text-xl font-bold">소회의실 대여</h1>
      <SearchBar 
        value={searchValue}
        placeholder="검색어를 입력하세요"
        onChangeText={setSearchValue}
        onSubmit={handleSearch}
      />
        
    </div>
  );
}