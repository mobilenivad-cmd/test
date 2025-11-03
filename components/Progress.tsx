import React from 'react';
import { ChartIcon } from './icons';

const ComingSoonFeature: React.FC<{title: string, description: string}> = ({title, description}) => (
    <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
);

const Progress: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg max-w-2xl">
            <div className="flex justify-center mb-6">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                    <ChartIcon className="w-12 h-12" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">پیشرفت و دورنما</h1>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">به زودی...</h2>
            <p className="text-gray-600 mb-8">
                صفحه پیشرفت و دورنما در حال توسعه است. این بخش به شما کمک می‌کند تا با تحلیل‌های هوشمند، دید بهتری نسبت به عملکرد تحصیلی خود پیدا کنید و برای آینده بهتر برنامه‌ریزی کنید.
            </p>

            <div className="space-y-4 text-right">
                <ComingSoonFeature 
                    title="نمودار پیشرفت"
                    description="نمایش روند پیشرفت تحصیلی شما در دروس مختلف در طول زمان."
                />
                <ComingSoonFeature 
                    title="تحلیل عملکرد با هوش مصنوعی"
                    description="بررسی نقاط قوت و ضعف، و ارائه راهکارهای شخصی‌سازی شده برای بهبود عملکرد."
                />
                <ComingSoonFeature 
                    title="پیش‌بینی نتایج"
                    description="تخمین نتایج احتمالی شما در آزمون‌ها بر اساس عملکرد فعلی."
                />
            </div>
        </div>
    </div>
  );
};

export default Progress;