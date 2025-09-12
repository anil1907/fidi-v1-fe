// Turkish UI Strings
export const UI_STRINGS = {
  // Navigation
  NAV: {
    DASHBOARD: "Genel Bakış",
    CLIENTS: "Danışanlar", 
    TEMPLATES: "Şablonlar",
    PLANS: "Diyet Planları",
    APPOINTMENTS: "Randevular",
    ANALYTICS: "Analitik",
    SETTINGS: "Ayarlar",
  },

  // Common Actions
  ACTIONS: {
    CREATE: "Oluştur",
    EDIT: "Düzenle",
    DELETE: "Sil",
    SAVE: "Kaydet",
    CANCEL: "İptal",
    VIEW: "Görüntüle",
    PRINT: "Yazdır",
    EXPORT: "Dışa Aktar",
    SEARCH: "Ara",
    FILTER: "Filtrele",
    ADD: "Ekle",
    REMOVE: "Kaldır",
  },

  // Form Labels
  FORMS: {
    FIRST_NAME: "Ad",
    LAST_NAME: "Soyad", 
    EMAIL: "Email",
    PHONE: "Telefon",
    BIRTH_DATE: "Doğum Tarihi",
    NOTES: "Notlar",
    GOALS: "Hedefler",
    NAME: "Ad",
    DESCRIPTION: "Açıklama",
    START_DATE: "Başlangıç Tarihi",
    END_DATE: "Bitiş Tarihi",
    TITLE: "Başlık",
    STATUS: "Durum",
  },

  // Status Labels
  STATUS: {
    ACTIVE: "Aktif",
    INACTIVE: "Pasif",
    COMPLETED: "Tamamlanmış",
    PENDING: "Beklemede",
    SCHEDULED: "Planlandı",
    DONE: "Tamamlandı",
    CANCELED: "İptal Edildi",
  },

  // Messages
  MESSAGES: {
    SUCCESS: {
      CLIENT_CREATED: "Danışan başarıyla eklendi.",
      CLIENT_UPDATED: "Danışan başarıyla güncellendi.",
      CLIENT_DELETED: "Danışan başarıyla silindi.",
      TEMPLATE_CREATED: "Şablon başarıyla oluşturuldu.",
      TEMPLATE_UPDATED: "Şablon başarıyla güncellendi.",
      TEMPLATE_DELETED: "Şablon başarıyla silindi.",
      PLAN_CREATED: "Diyet planı başarıyla oluşturuldu.",
      PLAN_UPDATED: "Diyet planı başarıyla güncellendi.",
      PLAN_DELETED: "Diyet planı başarıyla silindi.",
      APPOINTMENT_CREATED: "Randevu başarıyla oluşturuldu.",
      APPOINTMENT_UPDATED: "Randevu başarıyla güncellendi.",
      APPOINTMENT_DELETED: "Randevu başarıyla silindi.",
    },
    ERROR: {
      GENERIC: "Bir hata oluştu.",
      CLIENT_CREATE: "Danışan eklenirken bir hata oluştu.",
      CLIENT_UPDATE: "Danışan güncellenirken bir hata oluştu.",
      CLIENT_DELETE: "Danışan silinirken bir hata oluştu.",
      TEMPLATE_CREATE: "Şablon oluşturulurken bir hata oluştu.",
      TEMPLATE_UPDATE: "Şablon güncellenirken bir hata oluştu.",
      TEMPLATE_DELETE: "Şablon silinirken bir hata oluştu.",
      PLAN_CREATE: "Diyet planı oluşturulurken bir hata oluştu.",
      PLAN_UPDATE: "Diyet planı güncellenirken bir hata oluştu.",
      PLAN_DELETE: "Diyet planı silinirken bir hata oluştu.",
      APPOINTMENT_CREATE: "Randevu oluşturulurken bir hata oluştu.",
      APPOINTMENT_UPDATE: "Randevu güncellenirken bir hata oluştu.",
      APPOINTMENT_DELETE: "Randevu silinirken bir hata oluştu.",
    },
    EMPTY_STATES: {
      NO_CLIENTS: "Henüz danışan yok",
      NO_TEMPLATES: "Henüz şablon yok",
      NO_PLANS: "Henüz plan yok",
      NO_APPOINTMENTS: "Henüz randevu yok",
      NO_APPOINTMENTS_TODAY: "Bugün için randevu yok",
    },
  },

  // Placeholders
  PLACEHOLDERS: {
    SEARCH_CLIENTS: "Ad, email veya telefon ile ara...",
    SEARCH_GENERAL: "Danışan ara...",
    TEMPLATE_DESCRIPTION: "Bu şablon hakkında kısa bir açıklama...",
    NOTES: "Notlar...",
    ADD_ITEM: "+ Öğe Ekle",
    ITEM_NAME: "Öğe adı",
    AMOUNT: "Miktar",
  },
};

// Meal Types
export const MEAL_TYPES = [
  { value: "Kahvaltı", label: "Kahvaltı" },
  { value: "Öğle", label: "Öğle" },
  { value: "Akşam", label: "Akşam" },
  { value: "Ara Öğün", label: "Ara Öğün" },
] as const;

// Appointment Status Options
export const APPOINTMENT_STATUSES = [
  { value: "scheduled", label: "Planlandı" },
  { value: "done", label: "Tamamlandı" },
  { value: "canceled", label: "İptal Edildi" },
] as const;

// Client Status Options
export const CLIENT_STATUSES = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Pasif" },
  { value: "completed", label: "Tamamlanmış" },
] as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "d MMMM yyyy",
  INPUT: "yyyy-MM-dd",
  TIME: "HH:mm",
  DATETIME: "d MMMM yyyy HH:mm",
};

// Theme
export const THEME = {
  DEFAULT: "system" as const,
  OPTIONS: ["light", "dark", "system"] as const,
};

// Environment
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
};
