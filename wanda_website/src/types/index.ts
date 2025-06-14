export interface WandaCaller {
  phoneNumber: string
  name?: string
  age?: number
  city?: string
  foodPreferences?: string[]
  activitiesPreferences?: string[]
  shoppingPreferences?: string[]
  entertainmentPreferences?: string[]
  createdAt: string
  lastCalledAt?: string
}

export interface WandaVariableValues {
  callerName?: string;
  callerAge?: number;
  callerCity?: string;
  callerFoodPreferences?: string;
  callerActivitiesPreferences?: string;
  callerShoppingPreferences?: string;
  callerEntertainmentPreferences?: string;
  newCaller?: boolean;
}

export interface CallRecord {
  id: string
  callerPhoneNumber: string
  createdAt: string
  status?: string
  endedReason?: string
  summary?: string
  transcript?: string
  directionsSent?: boolean
  directionsPlaceName?: string
  directionsPlaceAddress?: string
  directionsMessageSid?: string
  lastSearchResults?: Array<{
    name: string
    address: string
    placeId: string
  }>
  lastSearchAt?: string
}

export interface SearchResult {
  name: string
  address: string
  placeId: string
}
