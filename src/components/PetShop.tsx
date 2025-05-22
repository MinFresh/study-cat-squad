
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface AccessoryItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
}

const PetShop: React.FC = () => {
  const { state, spendCatcoins, addPetAccessory } = useAppContext();
  const { toast } = useToast();
  
  const accessories: AccessoryItem[] = [
    {
      id: 'hat',
      name: '帽子',
      price: 50,
      icon: '🎩',
      description: '讓你的貓咪看起來更有氣質！'
    },
    {
      id: 'glasses',
      name: '眼鏡',
      price: 30,
      icon: '👓',
      description: '聰明的學習貓貓！'
    },
    {
      id: 'bowtie',
      name: '領結',
      price: 40,
      icon: '🎀',
      description: '參加正式場合必備！'
    }
  ];

  const handlePurchase = (item: AccessoryItem) => {
    const canPurchase = spendCatcoins(item.price);
    
    if (canPurchase) {
      addPetAccessory(item.id);
      toast({
        title: '購買成功！',
        description: `你已經成功購買了${item.name}！`,
      });
    } else {
      toast({
        title: '貓幣不足',
        description: '你需要更多貓幣來購買這個配飾！',
        variant: 'destructive',
      });
    }
  };

  // Check if accessory is already purchased
  const isAccessoryPurchased = (id: string) => {
    return state.petStatus.accessories.includes(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">貓咪商店</h2>
        <div className="text-catcoin flex items-center font-semibold">
          <span className="mr-1">🪙</span> {state.catcoins} 貓幣
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accessories.map((item) => {
          const purchased = isAccessoryPurchased(item.id);
          
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center justify-center text-4xl py-4">
                  {item.icon}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {!purchased ? (
                  <>
                    <div className="text-catcoin font-medium">
                      <span className="mr-1">🪙</span> {item.price}
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={state.catcoins < item.price}
                    >
                      購買
                    </Button>
                  </>
                ) : (
                  <div className="w-full text-center text-green-600 font-medium py-1">
                    已購買 ✓
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PetShop;
