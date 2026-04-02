import type { Skill } from '../types';

export interface BackgroundFeature {
  name: string;
  description: string;
}

export interface BackgroundEquipment {
  name: string;
  quantity?: number;
}

export interface BackgroundEquipmentPackage {
  items: BackgroundEquipment[];
  gold?: number;
}

export interface DndBackground {
  id: string;
  name: string;
  description: string;
  skillProficiencies: Skill[];
  toolProficiencies?: string[];
  languages?: number;
  features?: BackgroundFeature[];
  equipment?: BackgroundEquipmentPackage[];
}

export const srdBackgrounds: DndBackground[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    description: 'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine.',
    skillProficiencies: ['insight', 'religion'],
    toolProficiencies: ["Calligrapher's Supplies"],
    languages: 2,
    features: [
      {
        name: 'Shelter of the Faithful',
        description: 'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle. You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there.'
      }
    ],
    equipment: [
      {
        items: [
          { name: 'Prayer book (or prayer wheel)' },
          { name: 'Incense', quantity: 5 },
          { name: 'Vestments' },
          { name: 'Common clothes' },
          { name: 'Belt pouch' }
        ],
        gold: 15
      }
    ]
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description: 'You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld. You are far more familiar than most with the seedy underside of civilization.',
    skillProficiencies: ['deception', 'stealth'],
    toolProficiencies: ['Thieves\' Tools', 'One type of gaming set'],
    features: [
      {
        name: 'Criminal Contact',
        description: 'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.'
      }
    ],
    equipment: [
      {
        items: [
          { name: 'Crowbar' },
          { name: 'Dark common clothes with a hood' },
          { name: 'Belt pouch' }
        ],
        gold: 15
      }
    ]
  },
  {
    id: 'folk_hero',
    name: 'Folk Hero',
    description: 'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.',
    skillProficiencies: ['animalHandling', 'survival'],
    toolProficiencies: ['Vehicles (land)', 'One type of artisan\'s tools'],
    features: [
      {
        name: 'Rustic Hospitality',
        description: 'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.'
      }
    ],
    equipment: [
      {
        items: [
          { name: 'Artisan\'s tools (one of your choice)' },
          { name: 'Shovel' },
          { name: 'Iron pot' },
          { name: 'Common clothes' },
          { name: 'Belt pouch' }
        ],
        gold: 10
      }
    ]
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you master of your field, and now you seek to test your theories in the adventuring life.',
    skillProficiencies: ['arcana', 'history'],
    languages: 2,
    features: [
      {
        name: 'Researcher',
        description: 'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature.'
      }
    ],
    equipment: [
      {
        items: [
          { name: 'Bottle of black ink' },
          { name: 'Quill' },
          { name: 'Small knife' },
          { name: 'Letter from a dead colleague posing a question you have not yet been able to answer' },
          { name: 'Common clothes' },
          { name: 'Belt pouch' }
        ],
        gold: 10
      }
    ]
  },
  {
    id: 'soldier',
    name: 'Soldier',
    description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield. You might have been part of a standing national army or a mercenary company, or perhaps a member of a local militia.',
    skillProficiencies: ['athletics', 'intimidation'],
    toolProficiencies: ['Vehicles (land)', 'One type of gaming set'],
    features: [
      {
        name: 'Military Rank',
        description: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized.'
      }
    ],
    equipment: [
      {
        items: [
          { name: 'Insignia of rank' },
          { name: 'Trophy from a fallen enemy (a dagger, broken blade, or piece of a banner)' },
          { name: 'Bone dice or deck of cards' },
          { name: 'Common clothes' },
          { name: 'Belt pouch' }
        ],
        gold: 10
      }
    ]
  }
];