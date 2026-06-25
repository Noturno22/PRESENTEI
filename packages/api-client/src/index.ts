// Supabase client factories & context
export {
  createServerClient,
  createBrowserClient,
  createMobileClient,
  SupabaseProvider,
  useSupabase,
} from './supabase';

// React Query hooks
export {
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useProducts,
  useProductsByCategory,
  useKits,
  useProduct,
  useOrders,
  useOrder,
  useCreateOrder,
  useUpcomingBirthdays,
  useProfile,
  useUpdateProfile,
  useCategories,
  useDigitalCards,
  useCreateDigitalCard,
} from './hooks';

// Pure query/mutation functions
export {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getProducts,
  getProductsByCategory,
  getKits,
  getProductById,
  getOrders,
  getOrderById,
  createOrder,
  getUpcomingBirthdays,
  getContactsByMonth,
  getProfile,
  updateProfile,
  getCategories,
  getDigitalCards,
  createDigitalCard,
} from './queries';
