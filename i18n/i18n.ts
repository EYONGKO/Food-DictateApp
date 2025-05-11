import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    ok: 'OK',
    cancel: 'Cancel',
    goBack: 'Go Back',
  },
  profile: {
    title: 'Profile',
    editButton: 'Edit Profile',
    scansStat: 'Scans',
    savedStat: 'Saved',
    recipesStat: 'Recipes',
    language: 'Language',
    languageValue: 'English',
    units: 'Units',
    unitsValue: 'Metric',
    logoutButton: 'Logout',
    logoutConfirmTitle: 'Confirm Logout',
    logoutConfirmMessage: 'Are you sure you want to logout?',
  },
  editProfile: {
    title: 'Edit Profile',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    changePhoto: 'Change Photo',
    saveButton: 'Save Changes',
    saveSuccessTitle: 'Success',
    saveSuccessMessage: 'Profile updated successfully',
    saveErrorTitle: 'Error',
    saveErrorMessage: 'Failed to update profile',
    permissionDeniedTitle: 'Permission Denied',
    permissionDeniedMessage: 'Please allow access to your photo library',
  },
  scan: {
    title: 'Scan Food',
    permissionText: 'Camera permission is required to scan food',
    grantPermission: 'Grant Permission',
    positionText: 'Position food in Frame',
    captureButton: 'Capture',
    galleryButton: 'Choose from gallery',
  },
  library: {
    title: 'Library',
    loading: 'Loading your saved items...',
    emptyTitle: 'No Items Yet',
    emptySubtitle: 'Your scanned and saved items will appear here',
    confirmRemoveTitle: 'Remove Item',
    confirmRemoveMessage: 'Are you sure you want to remove this item?',
    removeButton: 'Remove',
    loadError: 'Failed to load library items',
    removeError: 'Failed to remove item',
  },
  settings: {
    title: 'Settings',
    account: {
      title: 'Account',
      profile: 'Profile',
      preferences: 'Preferences',
    },
    preferences: {
      title: 'Preferences',
      darkMode: 'Dark Mode',
      language: 'Language',
      units: 'Units',
    },
    notifications: {
      title: 'Notifications',
      pushNotifications: 'Push Notifications',
      emailNotifications: 'Email Notifications',
    },
    support: {
      title: 'Support',
      help: 'Help & Support',
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rateApp: 'Rate App',
    },
  },
};

// French translations
const frTranslations = {
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    ok: 'OK',
    cancel: 'Annuler',
    goBack: 'Retour',
  },
  profile: {
    title: 'Profil',
    editButton: 'Modifier le profil',
    scansStat: 'Scans',
    savedStat: 'Sauvegardés',
    recipesStat: 'Recettes',
    language: 'Langue',
    languageValue: 'Français',
    units: 'Unités',
    unitsValue: 'Métrique',
    logoutButton: 'Déconnexion',
    logoutConfirmTitle: 'Confirmer la déconnexion',
    logoutConfirmMessage: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },
  editProfile: {
    title: 'Modifier le profil',
    nameLabel: 'Nom',
    namePlaceholder: 'Entrez votre nom',
    emailLabel: 'Email',
    emailPlaceholder: 'Entrez votre email',
    changePhoto: 'Changer la photo',
    saveButton: 'Enregistrer',
    saveSuccessTitle: 'Succès',
    saveSuccessMessage: 'Profil mis à jour avec succès',
    saveErrorTitle: 'Erreur',
    saveErrorMessage: 'Échec de la mise à jour du profil',
    permissionDeniedTitle: 'Permission refusée',
    permissionDeniedMessage: 'Veuillez autoriser l\'accès à votre photothèque',
  },
  scan: {
    title: 'Scanner',
    permissionText: 'L\'autorisation de la caméra est requise pour scanner les aliments',
    grantPermission: 'Autoriser',
    positionText: 'Positionnez l\'aliment dans le cadre',
    captureButton: 'Capturer',
    galleryButton: 'Choisir dans la galerie',
  },
  library: {
    title: 'Bibliothèque',
    loading: 'Chargement de vos éléments sauvegardés...',
    emptyTitle: 'Aucun élément',
    emptySubtitle: 'Vos éléments scannés et sauvegardés apparaîtront ici',
    confirmRemoveTitle: 'Supprimer l\'élément',
    confirmRemoveMessage: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    removeButton: 'Supprimer',
    loadError: 'Échec du chargement des éléments',
    removeError: 'Échec de la suppression de l\'élément',
  },
  settings: {
    title: 'Paramètres',
    account: {
      title: 'Compte',
      profile: 'Profil',
      preferences: 'Préférences',
    },
    preferences: {
      title: 'Préférences',
      darkMode: 'Mode sombre',
      language: 'Langue',
      units: 'Unités',
    },
    notifications: {
      title: 'Notifications',
      pushNotifications: 'Notifications push',
      emailNotifications: 'Notifications par email',
    },
    support: {
      title: 'Support',
      help: 'Aide & Support',
      about: 'À propos',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      rateApp: 'Noter l\'application',
    },
  },
};

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 