# HomeInOne — Modèle de données (MCD/MLD) 🗄

## 1. Vue d'ensemble

Le modèle de données est organisé autour du concept central de **Foyer (Household)**. Toutes les données sont isolées par foyer. Un utilisateur appartient à un seul foyer.

### 1.1 Diagramme des domaines

```
                            ┌──────────────┐
                            │   CORE       │
                            │              │
                            │  User        │
                            │  Household   │
                            │  Category    │
                            │  Tag         │
                            │  Provider    │
                            │  File        │
                            └──────┬───────┘
                                   │
         ┌────────────┬────────────┼────────────┬──────────────┐
         │            │            │            │              │
    ┌────▼────┐  ┌────▼────┐ ┌────▼────┐ ┌────▼─────┐  ┌─────▼─────┐
    │CALENDAR │  │  NOTES  │ │  MAINT  │ │ VEHICLES │  │ INVENTORY │
    │         │  │         │ │         │ │          │  │           │
    │ Event   │  │ Note    │ │Property │ │ Vehicle  │  │ Item      │
    │ Remind  │  │ TaskList│ │ Room    │ │ Interv.  │  │ Warranty  │
    │         │  │ Task    │ │ Interv. │ │ FuelLog  │  │ ItemEvent │
    │         │  │Wishlist │ │ MaintTpl│ │ VehDoc   │  │ ItemDoc   │
    │         │  │ Wish    │ │         │ │ MaintTpl │  │           │
    └─────────┘  └─────────┘ └─────────┘ └──────────┘  └───────────┘
```

---

## 2. Schéma Prisma complet

```prisma
// ============================================================
// PRISMA SCHEMA — HomeInOne
// ============================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// CORE — Utilisateurs, Foyer, Éléments partagés
// ============================================================

model Household {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  members             User[]
  categories           Category[]
  tags                 Tag[]
  providers            Provider[]
  events               Event[]
  notes                Note[]
  taskLists            TaskList[]
  wishlists            Wishlist[]
  properties           Property[]
  vehicles             Vehicle[]
  inventoryItems       InventoryItem[]
  notificationSettings NotificationSetting[]
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String
  firstName      String
  lastName       String?
  color          String   @default("#3b82f6") // Couleur d'identification dans le calendrier
  avatar         String?                       // URL de l'avatar
  role           Role     @default(MEMBER)
  locale         String   @default("fr")       // Langue préférée
  theme          Theme    @default(SYSTEM)      // Thème préféré
  defaultCalView CalendarView @default(WEEK)   // Vue calendrier par défaut
  weekStartDay   Int      @default(1)           // 0=dimanche, 1=lundi
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  // Éléments créés par l'utilisateur
  createdEvents        Event[]          @relation("EventCreator")
  createdNotes         Note[]           @relation("NoteCreator")
  createdTasks         Task[]           @relation("TaskCreator")
  createdInventoryItems InventoryItem[] @relation("ItemCreator")

  // Assignations
  assignedEvents       EventAssignment[]
  assignedTasks        TaskAssignment[]
  assignedInterventions MaintenanceInterventionAssignment[]
  assignedVehicleInterventions VehicleInterventionAssignment[]

  // Notifications
  pushSubscriptions    PushSubscription[]

  @@index([householdId])
  @@index([email])
}

enum Role {
  ADMIN
  MEMBER
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}

enum CalendarView {
  DAY
  WEEK
  MONTH
}

// ============================================================
// CATÉGORIES — Système transversal
// ============================================================

model Category {
  id          String       @id @default(uuid())
  name        String
  icon        String?
  color       String       @default("#6b7280")
  scope       CategoryScope
  isDefault   Boolean      @default(false)  // Catégorie prédéfinie (non supprimable)
  isActive    Boolean      @default(true)
  sortOrder   Int          @default(0)
  createdAt   DateTime     @default(now())

  householdId String
  household   Household    @relation(fields: [householdId], references: [id])

  // Relations selon le scope
  events                    Event[]
  maintenanceInterventions  MaintenanceIntervention[]
  vehicleInterventions      VehicleIntervention[]
  inventoryItems            InventoryItem[]

  @@unique([householdId, scope, name])
  @@index([householdId, scope])
}

enum CategoryScope {
  CALENDAR           // Catégories d'événements (RDV, Vacances, Anniversaire...)
  MAINTENANCE        // Catégories d'entretien logement (Plomberie, Électricité...)
  VEHICLE            // Catégories d'entretien véhicule (Vidange, Freins...)
  INVENTORY          // Catégories d'objets (Électroménager, High-tech...)
}

// ============================================================
// TAGS — Étiquettes libres (partagées Notes/Tâches/Envies)
// ============================================================

model Tag {
  id          String   @id @default(uuid())
  name        String
  color       String   @default("#6b7280")
  createdAt   DateTime @default(now())

  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  // Relations (many-to-many)
  notes       NoteTag[]
  taskLists   TaskListTag[]
  wishlists   WishlistTag[]

  @@unique([householdId, name])
  @@index([householdId])
}

// ============================================================
// PRESTATAIRES — Carnet d'adresses partagé
// ============================================================

model Provider {
  id          String   @id @default(uuid())
  name        String
  specialty   String?
  phone       String?
  email       String?
  address     String?
  website     String?
  notes       String?
  rating      Int?     // 1-5
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  // Relations
  maintenanceInterventions MaintenanceIntervention[]
  vehicleInterventions     VehicleIntervention[]
  itemEvents               ItemEvent[]

  @@index([householdId])
}

// ============================================================
// FICHIERS — Stockage de fichiers uploadés
// ============================================================

model UploadedFile {
  id           String   @id @default(uuid())
  originalName String
  storagePath  String                         // Chemin dans le stockage
  mimeType     String
  size         Int                             // Taille en octets
  thumbnailPath String?                        // Chemin du thumbnail (images)
  createdAt    DateTime @default(now())

  // Relations polymorphiques (un fichier appartient à un contexte)
  maintenanceInterventionId String?
  maintenanceIntervention   MaintenanceIntervention? @relation(fields: [maintenanceInterventionId], references: [id], onDelete: Cascade)

  vehicleInterventionId String?
  vehicleIntervention   VehicleIntervention? @relation(fields: [vehicleInterventionId], references: [id], onDelete: Cascade)

  itemEventId String?
  itemEvent   ItemEvent? @relation(fields: [itemEventId], references: [id], onDelete: Cascade)

  inventoryItemId String?
  inventoryItem   InventoryItem? @relation("ItemPhotos", fields: [inventoryItemId], references: [id], onDelete: Cascade)

  warrantyId String?
  warranty   Warranty? @relation(fields: [warrantyId], references: [id], onDelete: Cascade)

  itemDocumentId String?
  itemDocument   ItemDocument? @relation(fields: [itemDocumentId], references: [id], onDelete: Cascade)

  vehicleDocumentId String?
  vehicleDocument   VehicleDocument? @relation(fields: [vehicleDocumentId], references: [id], onDelete: Cascade)

  @@index([maintenanceInterventionId])
  @@index([vehicleInterventionId])
  @@index([itemEventId])
  @@index([inventoryItemId])
  @@index([warrantyId])
  @@index([itemDocumentId])
  @@index([vehicleDocumentId])
}

// ============================================================
// MODULE : AGENDA PARTAGÉ 🗓
// ============================================================

model Event {
  id          String      @id @default(uuid())
  title       String
  description String?
  location    String?
  startDate   DateTime
  endDate     DateTime?
  allDay      Boolean     @default(false)
  rrule       String?     // Règle de récurrence RRULE (RFC 5545)
  exDates     DateTime[]  // Dates d'exception (occurrences supprimées)
  isRecurrenceException Boolean @default(false)  // Cette occurrence est une exception modifiée
  parentEventId String?                          // Lien vers l'événement parent (si exception)
  parentEvent   Event?    @relation("EventExceptions", fields: [parentEventId], references: [id], onDelete: Cascade)
  exceptions    Event[]   @relation("EventExceptions")

  // Source inter-modules (événement auto-généré)
  sourceType    EventSourceType?   // Quel module a généré cet événement
  sourceId      String?            // ID de l'entité source

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relations
  householdId String
  household   Household  @relation(fields: [householdId], references: [id])

  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])

  createdById String
  createdBy   User       @relation("EventCreator", fields: [createdById], references: [id])

  // Assignation aux membres
  assignments EventAssignment[]

  // Rappels
  reminders   EventReminder[]

  @@index([householdId, startDate])
  @@index([householdId, categoryId])
  @@index([sourceType, sourceId])
  @@index([parentEventId])
}

enum EventSourceType {
  TASK              // Tâche avec échéance
  MAINTENANCE       // Intervention entretien logement
  VEHICLE           // Intervention véhicule
  VEHICLE_DOCUMENT  // Document véhicule (expiration)
  WARRANTY          // Garantie objet (expiration)
}

model EventAssignment {
  id      String @id @default(uuid())
  eventId String
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([eventId, userId])
}

model EventReminder {
  id         String          @id @default(uuid())
  minutesBefore Int                         // Minutes avant l'événement
  isSent     Boolean         @default(false)
  sentAt     DateTime?

  eventId    String
  event      Event           @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@index([eventId])
  @@index([isSent])
}

// ============================================================
// MODULE : NOTES & LISTES 📝
// ============================================================

// --- Dossiers (par espace : notes, tasks, wishlists) ---

model Folder {
  id          String      @id @default(uuid())
  name        String
  scope       FolderScope
  parentId    String?
  parent      Folder?     @relation("FolderTree", fields: [parentId], references: [id], onDelete: Cascade)
  children    Folder[]    @relation("FolderTree")
  sortOrder   Int         @default(0)
  createdAt   DateTime    @default(now())

  householdId String

  // Relations
  notes       Note[]
  taskLists   TaskList[]
  wishlists   Wishlist[]

  @@index([householdId, scope])
  @@index([parentId])
}

enum FolderScope {
  NOTES
  TASKS
  WISHLISTS
}

// --- Notes ---

model Note {
  id          String   @id @default(uuid())
  title       String
  content     String?  // HTML rich text (Tiptap)
  isPinned    Boolean  @default(false)
  isPrivate   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  folderId    String?
  folder      Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)

  createdById String
  createdBy   User      @relation("NoteCreator", fields: [createdById], references: [id])

  tags        NoteTag[]

  @@index([householdId])
  @@index([folderId])
  @@index([createdById])
  @@index([isPinned])
}

model NoteTag {
  noteId String
  note   Note   @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tagId  String
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
}

// --- Tâches ---

model TaskList {
  id          String   @id @default(uuid())
  title       String
  isPrivate   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  folderId    String?
  folder      Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)

  tasks       Task[]
  tags        TaskListTag[]

  @@index([householdId])
  @@index([folderId])
}

model TaskListTag {
  taskListId String
  taskList   TaskList @relation(fields: [taskListId], references: [id], onDelete: Cascade)
  tagId      String
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([taskListId, tagId])
}

model Task {
  id            String     @id @default(uuid())
  title         String
  description   String?    // HTML rich text
  status        TaskStatus @default(TODO)
  priority      Priority   @default(MEDIUM)
  dueDate       DateTime?
  completedAt   DateTime?
  sortOrder     Int        @default(0)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  taskListId    String
  taskList      TaskList   @relation(fields: [taskListId], references: [id], onDelete: Cascade)

  createdById   String
  createdBy     User       @relation("TaskCreator", fields: [createdById], references: [id])

  assignments   TaskAssignment[]

  @@index([taskListId])
  @@index([status])
  @@index([dueDate])
  @@index([createdById])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model TaskAssignment {
  id     String @id @default(uuid())
  taskId String
  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([taskId, userId])
}

// --- Envies (Wishlist) ---

model Wishlist {
  id          String   @id @default(uuid())
  title       String
  description String?
  isPrivate   Boolean  @default(false)
  budget      Decimal? @db.Decimal(10, 2)
  ownerId     String?  // Membre à qui est destinée la wishlist (cadeaux)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  folderId    String?
  folder      Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)

  wishes      Wish[]
  tags        WishlistTag[]

  @@index([householdId])
  @@index([folderId])
}

model WishlistTag {
  wishlistId String
  wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  tagId      String
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([wishlistId, tagId])
}

model Wish {
  id          String     @id @default(uuid())
  name        String
  description String?
  url         String?
  imageUrl    String?
  price       Decimal?   @db.Decimal(10, 2)
  priority    WishPriority @default(NICE_TO_HAVE)
  status      WishStatus   @default(PENDING)
  purchaseDate DateTime?
  sortOrder   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  wishlistId  String
  wishlist    Wishlist   @relation(fields: [wishlistId], references: [id], onDelete: Cascade)

  createdById String

  priceHistory WishPriceHistory[]

  @@index([wishlistId])
  @@index([status])
}

enum WishPriority {
  MEH            // Bof
  NICE_TO_HAVE   // Sympa
  REALLY_WANT    // Vraiment envie
  MUST_HAVE      // Indispensable
}

enum WishStatus {
  PENDING      // En attente
  PURCHASED    // Acheté
  GIFTED       // Offert
  ABANDONED    // Abandonné
}

model WishPriceHistory {
  id        String   @id @default(uuid())
  price     Decimal  @db.Decimal(10, 2)
  date      DateTime @default(now())

  wishId    String
  wish      Wish     @relation(fields: [wishId], references: [id], onDelete: Cascade)

  @@index([wishId, date])
}

// ============================================================
// MODULE : ENTRETIEN LOGEMENT 🏠
// ============================================================

model Property {
  id            String       @id @default(uuid())
  name          String
  address       String?
  type          PropertyType?
  surface       Decimal?     @db.Decimal(8, 2) // m²
  moveInDate    DateTime?
  photo         String?      // URL
  notes         String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  householdId   String
  household     Household    @relation(fields: [householdId], references: [id])

  rooms         Room[]
  interventions MaintenanceIntervention[]
  inventoryItems InventoryItem[]

  @@index([householdId])
}

enum PropertyType {
  HOUSE
  APARTMENT
  STUDIO
  OTHER
}

model Room {
  id          String   @id @default(uuid())
  name        String
  icon        String?
  isDefault   Boolean  @default(false) // Pièce prédéfinie
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())

  propertyId  String
  property    Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  interventions MaintenanceIntervention[]
  inventoryItems InventoryItem[]

  @@unique([propertyId, name])
  @@index([propertyId])
}

model MaintenanceIntervention {
  id            String                @id @default(uuid())
  title         String
  description   String?
  status        InterventionStatus    @default(TO_PLAN)
  priority      Priority              @default(MEDIUM)
  scheduledDate DateTime?
  completedDate DateTime?
  rrule         String?               // Récurrence RRULE
  isRecurring   Boolean               @default(false)
  isActive      Boolean               @default(true) // Pour désactiver une récurrence
  estimatedCost Decimal?              @db.Decimal(10, 2)
  actualCost    Decimal?              @db.Decimal(10, 2)
  doneBy        DoneBy?
  templateId    String?               // Lien vers le modèle d'entretien source
  createdAt     DateTime              @default(now())
  updatedAt     DateTime              @updatedAt

  propertyId    String
  property      Property              @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  roomId        String?
  room          Room?                 @relation(fields: [roomId], references: [id], onDelete: SetNull)

  categoryId    String?
  category      Category?             @relation(fields: [categoryId], references: [id])

  providerId    String?
  provider      Provider?             @relation(fields: [providerId], references: [id], onDelete: SetNull)

  // Assignations
  assignments   MaintenanceInterventionAssignment[]

  // Fichiers joints
  files         UploadedFile[]

  // Lien avec l'inventaire
  inventoryItemId String?
  inventoryItem   InventoryItem?      @relation(fields: [inventoryItemId], references: [id], onDelete: SetNull)

  @@index([propertyId])
  @@index([roomId])
  @@index([categoryId])
  @@index([status])
  @@index([scheduledDate])
  @@index([inventoryItemId])
}

model MaintenanceInterventionAssignment {
  id             String                  @id @default(uuid())
  interventionId String
  intervention   MaintenanceIntervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  userId         String
  user           User                    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([interventionId, userId])
}

enum InterventionStatus {
  TO_PLAN
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum DoneBy {
  SELF
  PROVIDER
}

// Modèles d'entretien prédéfinis
model MaintenanceTemplate {
  id          String   @id @default(uuid())
  name        String
  description String?
  scope       MaintenanceTemplateScope
  categoryKey String                    // Clé de la catégorie associée
  rrule       String                    // Récurrence par défaut
  icon        String?
  isDefault   Boolean  @default(true)   // Modèle fourni par l'app

  @@index([scope])
}

enum MaintenanceTemplateScope {
  PROPERTY    // Modèles pour logement
  VEHICLE     // Modèles pour véhicule
}

// ============================================================
// MODULE : ENTRETIEN VÉHICULES 🚗
// ============================================================

model Vehicle {
  id                 String        @id @default(uuid())
  name               String
  type               VehicleType
  make               String?       // Marque
  model              String?       // Modèle
  year               Int?          // Millésime
  licensePlate       String?
  vin                String?
  fuelType           FuelType?
  registrationDate   DateTime?     // Date de mise en circulation
  purchaseDate       DateTime?
  currentMileage     Int?          // Dernier relevé km
  lastMileageDate    DateTime?     // Date du dernier relevé
  estimatedAnnualKm  Int?          // km/an estimé (auto-calculé ou override)
  isEstimatedKmManual Boolean      @default(false) // Override manuel du km annuel
  photo              String?
  notes              String?
  isArchived         Boolean       @default(false)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  householdId        String
  household          Household     @relation(fields: [householdId], references: [id])

  interventions      VehicleIntervention[]
  mileageLogs        MileageLog[]
  fuelLogs           FuelLog[]
  documents          VehicleDocument[]

  @@index([householdId])
  @@index([isArchived])
}

enum VehicleType {
  CAR
  MOTORCYCLE
}

enum FuelType {
  GASOLINE     // Essence
  DIESEL
  HYBRID
  ELECTRIC
  LPG          // GPL
}

model VehicleIntervention {
  id            String             @id @default(uuid())
  title         String
  description   String?
  status        InterventionStatus @default(TO_PLAN)
  priority      Priority           @default(MEDIUM)
  scheduledDate DateTime?
  completedDate DateTime?
  mileageAtCompletion Int?         // km au moment de l'intervention
  rrule         String?            // Récurrence temporelle
  recurringKm   Int?               // Intervalle km (ex: 15000)
  isRecurring   Boolean            @default(false)
  isActive      Boolean            @default(true)
  estimatedCost Decimal?           @db.Decimal(10, 2)
  actualCost    Decimal?           @db.Decimal(10, 2)
  partsCost     Decimal?           @db.Decimal(10, 2)  // Coût pièces
  laborCost     Decimal?           @db.Decimal(10, 2)  // Coût main d'œuvre
  doneBy        VehicleDoneBy?
  templateId    String?
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  vehicleId     String
  vehicle       Vehicle            @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  categoryId    String?
  category      Category?          @relation(fields: [categoryId], references: [id])

  providerId    String?
  provider      Provider?          @relation(fields: [providerId], references: [id], onDelete: SetNull)

  // Assignations
  assignments   VehicleInterventionAssignment[]

  // Fichiers joints
  files         UploadedFile[]

  @@index([vehicleId])
  @@index([categoryId])
  @@index([status])
  @@index([scheduledDate])
}

model VehicleInterventionAssignment {
  id             String              @id @default(uuid())
  interventionId String
  intervention   VehicleIntervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  userId         String
  user           User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([interventionId, userId])
}

enum VehicleDoneBy {
  SELF
  GARAGE
  PROVIDER
}

model MileageLog {
  id        String         @id @default(uuid())
  date      DateTime
  mileage   Int
  source    MileageSource  @default(MANUAL)
  createdAt DateTime       @default(now())

  vehicleId String
  vehicle   Vehicle        @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@index([vehicleId, date])
}

enum MileageSource {
  MANUAL
  INTERVENTION
  FUEL_LOG
}

model FuelLog {
  id          String    @id @default(uuid())
  date        DateTime
  mileage     Int
  liters      Decimal   @db.Decimal(6, 2)
  amount      Decimal   @db.Decimal(8, 2) // Montant payé
  fuelType    FuelType?
  isFull      Boolean   @default(true)    // Plein complet
  station     String?
  notes       String?
  // Calculé
  consumption Decimal?  @db.Decimal(4, 1)  // L/100km (null si plein partiel)
  createdAt   DateTime  @default(now())

  vehicleId   String
  vehicle     Vehicle   @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@index([vehicleId, date])
}

model VehicleDocument {
  id             String             @id @default(uuid())
  type           VehicleDocType
  expirationDate DateTime?
  issueDate      DateTime?
  documentNumber String?
  notes          String?

  // Champs spécifiques CT
  ctResult       CtResult?
  ctCenter       String?

  // Champs spécifiques Assurance
  insurer        String?
  contractNumber String?

  // Champs spécifiques Permis
  categories     String?             // A, B, C...
  memberUserId   String?             // Permis lié au membre, pas au véhicule

  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  vehicleId      String
  vehicle        Vehicle             @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  files          UploadedFile[]

  @@index([vehicleId])
  @@index([type])
  @@index([expirationDate])
}

enum VehicleDocType {
  REGISTRATION     // Carte grise
  INSURANCE        // Assurance
  TECHNICAL_INSPECTION // Contrôle technique
  DRIVING_LICENSE   // Permis de conduire
  CRIT_AIR          // Vignette Crit'Air
  OTHER
}

enum CtResult {
  FAVORABLE
  UNFAVORABLE
  COUNTER_VISIT
}

// ============================================================
// MODULE : INVENTAIRE OBJETS 📦
// ============================================================

model InventoryItem {
  id            String          @id @default(uuid())
  name          String
  description   String?
  brand         String?
  model         String?
  serialNumber  String?
  barcode       String?         // EAN / UPC
  purchaseDate  DateTime?
  purchasePrice Decimal?        @db.Decimal(10, 2)
  purchasePlace String?
  status        ItemStatus      @default(FUNCTIONAL)
  notes         String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  householdId   String
  household     Household       @relation(fields: [householdId], references: [id])

  categoryId    String?
  category      Category?       @relation(fields: [categoryId], references: [id])

  propertyId    String?
  property      Property?       @relation(fields: [propertyId], references: [id], onDelete: SetNull)

  roomId        String?
  room          Room?           @relation(fields: [roomId], references: [id], onDelete: SetNull)

  createdById   String
  createdBy     User            @relation("ItemCreator", fields: [createdById], references: [id])

  // Relations
  photos        UploadedFile[]  @relation("ItemPhotos")
  warranties    Warranty[]
  documents     ItemDocument[]
  events        ItemEvent[]
  maintenanceInterventions MaintenanceIntervention[]

  @@index([householdId])
  @@index([categoryId])
  @@index([propertyId])
  @@index([roomId])
  @@index([barcode])
  @@index([status])
}

enum ItemStatus {
  FUNCTIONAL
  BROKEN
  IN_REPAIR
  OUT_OF_SERVICE
  SOLD
  GIVEN_AWAY
}

model Warranty {
  id          String       @id @default(uuid())
  type        WarrantyType @default(LEGAL)
  startDate   DateTime
  endDate     DateTime
  conditions  String?
  reminderSent Boolean     @default(false)
  createdAt   DateTime     @default(now())

  itemId      String
  item        InventoryItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  files       UploadedFile[]

  @@index([itemId])
  @@index([endDate])
}

enum WarrantyType {
  LEGAL          // Garantie légale (2 ans EU)
  MANUFACTURER   // Garantie constructeur
  RETAILER       // Garantie vendeur
  EXTENDED       // Extension de garantie
}

model ItemDocument {
  id        String       @id @default(uuid())
  type      ItemDocType
  name      String?
  date      DateTime?
  notes     String?
  createdAt DateTime     @default(now())

  itemId    String
  item      InventoryItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  files     UploadedFile[]

  @@index([itemId])
}

enum ItemDocType {
  PURCHASE_INVOICE   // Facture d'achat
  WARRANTY_DOC       // Document de garantie
  MANUAL             // Manuel d'utilisation
  REPAIR_QUOTE       // Devis réparation
  REPAIR_INVOICE     // Facture réparation
  OTHER
}

model ItemEvent {
  id          String        @id @default(uuid())
  type        ItemEventType
  date        DateTime
  title       String
  description String?
  cost        Decimal?      @db.Decimal(10, 2)
  doneBy      ItemDoneBy?
  underWarranty Boolean     @default(false)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  itemId      String
  item        InventoryItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  providerId  String?
  provider    Provider?     @relation(fields: [providerId], references: [id], onDelete: SetNull)

  // Lien optionnel vers une intervention du module Entretien
  maintenanceInterventionId String?

  files       UploadedFile[]

  @@index([itemId, date])
  @@index([type])
}

enum ItemEventType {
  BREAKDOWN       // Panne
  REPAIR          // Réparation
  MAINTENANCE     // Entretien
  UPDATE          // Mise à jour
  MODIFICATION    // Modification
  OTHER
}

enum ItemDoneBy {
  SELF
  PROVIDER
  WARRANTY_SERVICE // SAV
}

// ============================================================
// NOTIFICATIONS PUSH
// ============================================================

model PushSubscription {
  id        String   @id @default(uuid())
  endpoint  String
  p256dh    String   // Clé publique
  auth      String   // Secret d'authentification
  userAgent String?  // Info navigateur/appareil
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model NotificationSetting {
  id            String   @id @default(uuid())
  scope         NotificationScope
  enabled       Boolean  @default(true)
  advanceMinutes Int[]   // Délais en minutes avant l'événement [1440, 60] = 1 jour + 1h

  householdId   String
  household     Household @relation(fields: [householdId], references: [id])

  userId        String?  // Null = paramètre global du foyer

  @@unique([householdId, userId, scope])
}

enum NotificationScope {
  CALENDAR_EVENT
  TASK_DUE
  MAINTENANCE_DUE
  VEHICLE_MAINTENANCE_DUE
  VEHICLE_DOCUMENT_EXPIRY
  WARRANTY_EXPIRY
}
```

---

## 3. Index et performance

### 3.1 Index principaux

Tous les index sont définis dans le schéma Prisma ci-dessus via `@@index`. Les plus critiques :

| Table | Index | Justification |
|---|---|---|
| Event | `[householdId, startDate]` | Requête principale : événements d'un foyer sur une période |
| Event | `[sourceType, sourceId]` | Retrouver l'événement auto-généré par un autre module |
| Task | `[taskListId]`, `[dueDate]`, `[status]` | Filtres les plus fréquents |
| MaintenanceIntervention | `[propertyId]`, `[scheduledDate]`, `[status]` | Tableau de bord logement |
| VehicleIntervention | `[vehicleId]`, `[scheduledDate]` | Tableau de bord véhicule |
| FuelLog | `[vehicleId, date]` | Historique chronologique des pleins |
| InventoryItem | `[householdId]`, `[barcode]`, `[categoryId]` | Recherche et filtres |
| Warranty | `[endDate]` | Requête cron pour alertes expiration |
| VehicleDocument | `[expirationDate]` | Requête cron pour alertes expiration |

### 3.2 Relations clés

| Relation | Type | Description |
|---|---|---|
| Household → User | 1:N | Un foyer a plusieurs membres |
| Event → EventAssignment → User | N:M | Un événement peut être assigné à plusieurs membres |
| Task → TaskAssignment → User | N:M | Une tâche peut être assignée à plusieurs membres |
| Property → Room | 1:N | Un logement a plusieurs pièces |
| Room → InventoryItem | 1:N | Une pièce peut contenir plusieurs objets |
| InventoryItem → Warranty | 1:N | Un objet peut avoir plusieurs garanties |
| InventoryItem → ItemEvent | 1:N | Un objet a un historique d'événements |
| Vehicle → VehicleIntervention | 1:N | Un véhicule a plusieurs interventions |
| Vehicle → FuelLog | 1:N | Un véhicule a plusieurs pleins |
| Provider → MaintenanceIntervention | 1:N | Un prestataire peut avoir plusieurs interventions |
| Provider → VehicleIntervention | 1:N | Un prestataire peut aussi intervenir sur des véhicules |
| Provider → ItemEvent | 1:N | Un prestataire peut réparer des objets |

---

## 4. Seed (données initiales)

Le fichier `prisma/seed.ts` peuplera la base avec :

- **Catégories prédéfinies** : calendrier (8), entretien logement (12), véhicule (15), inventaire (17)
- **Pièces par défaut** : les 13 pièces prédéfinies (créées pour chaque nouveau logement)
- **Modèles d'entretien** : logement (12 modèles) + voiture (12 modèles) + moto (10 modèles)
- **Paramètres de notification** : valeurs par défaut par scope

---

## 5. Prochaines étapes

- [ ] **Phase 5** — Charte graphique & UI/UX
- [ ] **Phase 6** — Roadmap & sprints

---

*Document créé le 08/04/2026 — Version 1.0*
