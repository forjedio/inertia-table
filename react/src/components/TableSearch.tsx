import React from 'react';

interface TableSearchProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    placeholder?: string;
    className?: string;
}

export function TableSearch({ searchTerm, onSearch, placeholder = 'Search...', className = '' }: TableSearchProps) {
    return (
        <div className="relative">
            <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
            </svg>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={placeholder}
                aria-label="Search table"
                className={`pl-9 ${className}`}
            />
        </div>
    );
}
