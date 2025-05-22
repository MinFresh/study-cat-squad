
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import CatPet from '@/components/CatPet';
import PetShop from '@/components/PetShop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const Pet = () => {
  const { state } = useAppContext();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">虛擬寵物</h1>
      <p className="text-muted-foreground mb-8">照顧你的學習夥伴</p>
      
      <Tabs defaultValue="pet" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="pet">寵物</TabsTrigger>
          <TabsTrigger value="shop">商店</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pet" className="focus-visible:outline-none">
          <Card className="p-8">
            <div className="flex flex-col items-center">
              <CatPet 
                mood={state.petStatus.mood}
                accessories={state.petStatus.accessories}
                catcoins={state.catcoins}
              />
              
              <div className="mt-8 bg-gray-50 rounded-lg p-4 w-full max-w-md">
                <h3 className="font-semibold mb-2">如何讓貓咪開心？</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
                    <span>每天完成學習任務</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
                    <span>使用番茄鐘專注學習</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
                    <span>達成學習目標和解鎖成就</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</div>
                    <span>購買配飾裝扮你的貓咪</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="shop" className="focus-visible:outline-none">
          <Card className="p-8">
            <PetShop />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pet;
