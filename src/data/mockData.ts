export interface Pet {
  id: string;
  name: string;
  breed: string;
  location: string;
  time: string;
  imageUrl: string;
  type: 'dog' | 'cat' | 'other';
  status: 'adopt' | 'lost';
  reward?: string;
  isUrgent?: boolean;
  description: string;
  publisher: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  tags?: string[];
  age?: string;
  health?: string;
}

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: '金毛寻回犬',
    location: '上海市 静安区',
    time: '1小时前发布',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyrmNpTem6-fXxqlypCMnLVvhzwXaUQIPBHlHf9Ve6ntpjDP_2MXmBX-Velm2wzi-G6iunmk7FCP_Y_IIS95CMgmqhi71uErRk7xJoobJM7EbBdX286_TAGIatEeguF0SK6meoCoqH6rera46wYQAARdc8sHIJX9Oi1ua_pJKntSHSN1vM8_ndab1_VmnCTJ73Mls70R0Wf6poDnJKvJNaNwU0M4vWHELjOE-cuYCvLgv8hyQ8-8VZlY3NAvHWPeTeL5FQBDTMsdFD',
    type: 'dog',
    status: 'lost',
    reward: '¥1000',
    isUrgent: true,
    description: 'Buddy 在静安公园附近走失，性格温顺，叫名字会有反应。脖子上有一个红色项圈。',
    publisher: {
      name: '张先生',
      avatar: 'https://i.pravatar.cc/150?u=1',
      verified: true
    },
    age: '3岁'
  },
  {
    id: '2',
    name: 'Luna',
    breed: '暹罗猫',
    location: '上海市 浦东新区',
    time: '3小时前发布',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvAFg0-BMjLAh-DRCC6UWxx7Zb8bRy4cvvNryI-RHXO64J_PplQcQXVHIRosni-yXVGX_R4X9ItvVUiyJJqq_xdRiNrSnbVCh1caxoKsX0h3lkOtoimseoPDI8V2ZSQtdTog2uf-E8QiWC_auI11ey4gimr4zcaC0bdTID3AqexfkAwOPZL-YSHmeoejpk2J2orgjpWptZXZvufQURo5hhdubHlj6TAwJo49gEVG_MgNwTg0pzaP2WGnQJQUZB_lklU9cmzelp8hsZ',
    type: 'cat',
    status: 'lost',
    reward: '¥5000',
    isUrgent: true,
    description: 'Luna 是一只非常粘人的暹罗猫。性格温顺，喜欢和人互动。已经完成了基础免疫和驱虫，身体健康。',
    publisher: {
      name: 'User123',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbh_4gG_k_Fcy-tycKlN9ukdUmhTaYy_YrqqdYg2ismb13xutkYxAETeq9dtHdJmTiziV9V-z30O-9AbcSF9m8WwAfbegbqK7jTdiDoVIZNxPCvSIVQis5Nx8fLvBaX-m33izKLv01G952u2s7b7bVeXw9uvAKdVNFHFKJcf9nFP89hLSiSy5CklmLsWnUS-g4aabxctuniJDQJN1fxuILrUN_Hu5nc1hDWBSrWS1G6xjRD6SsYd01IqKKRFIgsNTkg1gwkufHL3pN',
      verified: true
    },
    age: '1岁',
    health: '已免疫'
  },
  {
    id: '3',
    name: 'Max',
    breed: '比格犬',
    location: '上海市 徐汇区',
    time: '5小时前发布',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdkuBSUOv8Fc4LzJiZ-BjgKP4eO4RKvUrjSMI2rvY96BQycFn6yhEwMMTEo5d73Rdi_YTNYg_2F-7OlxMOGe1VL1DrvKfYD0LgagGYfozxCqUhxLpKl6cxGWToavrEe41FrU_40LQEM-r-6tPrfSZH60J2K0zQiZSkuvf6lUhJOZrW4Ie2mr-rJ5KseLV7hNs5npkgN4qeLOoZwMdz2OnQIMJit4o4Eryp56wAhKB3kYePB1oUMsSdprLvILra1ZXxC6tfDzrzKt3N',
    type: 'dog',
    status: 'lost',
    reward: '¥2000',
    isUrgent: true,
    description: 'Max 是一只活泼的比格犬，喜欢到处嗅。',
    publisher: {
      name: '李小姐',
      avatar: 'https://i.pravatar.cc/150?u=3',
      verified: false
    },
    age: '2岁'
  },
  {
    id: '4',
    name: 'Bella',
    breed: '布偶猫',
    location: '上海市 黄浦区',
    time: '1天前发布',
    imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
    type: 'cat',
    status: 'adopt',
    description: 'Bella 是一只甜美的布偶猫，寻找一个温暖的家。',
    publisher: {
      name: '王阿姨',
      avatar: 'https://i.pravatar.cc/150?u=4',
      verified: true
    },
    age: '6个月',
    tags: ['同城', '封窗', '回访']
  },
  {
    id: '5',
    name: 'Charlie',
    breed: '柯基',
    location: '上海市 长宁区',
    time: '2天前发布',
    imageUrl: 'https://images.unsplash.com/photo-1612536053381-696179b536c9?auto=format&fit=crop&q=80&w=800',
    type: 'dog',
    status: 'adopt',
    description: 'Charlie 是一只可爱的柯基，腿短屁股大。',
    publisher: {
      name: '赵先生',
      avatar: 'https://i.pravatar.cc/150?u=5',
      verified: true
    },
    age: '1.5岁',
    tags: ['有经验', '同城']
  }
];
