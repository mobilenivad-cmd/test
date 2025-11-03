
import React from 'react';
import { TestIcon } from './icons';

const Exams: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white p-12 rounded-2xl shadow-lg max-w-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
                        <TestIcon className="w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">آزمون‌ها</h1>
                <h2 className="text-xl font-semibold text-indigo-600 mb-4">این بخش به زودی راه‌اندازی خواهد شد</h2>
                <p className="text-gray-600">
                    ما در حال کار بر روی بخش آزمون‌ها هستیم. به زودی می‌توانید در آزمون‌های آزمایشی شرکت کنید، نتایج خود را تحلیل کرده و برای آزمون‌های اصلی آماده شوید.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800">آزمون‌های در حال انجام 📝</h4>
                        <p className="text-sm text-gray-600 mt-1">آزمون‌های فعال شما در اینجا نمایش داده می‌شود.</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800">آزمون‌های برنامه‌ریزی شده 📅</h4>
                        <p className="text-sm text-gray-600 mt-1">آزمون‌های آینده را در این بخش مدیریت کنید.</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800">نتایج آزمون‌ها 📊</h4>
                        <p className="text-sm text-gray-600 mt-1">نتایج و آمار آزمون‌های قبلی را مشاهده کنید.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exams;
