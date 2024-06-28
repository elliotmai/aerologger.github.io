# AeroLogger - Log Your Aircraft Spots

## Purpose

AeroLogger is a web application designed for aviation enthusiasts to log and manage their aircraft spotting experiences. Users can create detailed log entries for each aircraft they spot, including specific details about the aircraft and its flight. Additionally, users can upload photos to galleries associated with each log entry, enabling them to maintain a comprehensive and visually rich record of their spotting adventures.

## Core Functionality

### User Authentication
- **Signup**: Users can create a new account by providing their first name, last name, email, and password. A verification email is sent upon successful signup.
- **Login**: Users can log in using their email and password. Email verification is required to access the application.
- **Forgot Password**: Users can reset their password by providing their email address.
- **Resend Verification**: Users can request to resend the verification email.

### Logbook Management
- **Create Log Entry**: Users can add a new spot by providing details such as aircraft type, operator, aircraft ID, flight number, date spotted, location, origin, destination, and photos.
- **View Logbook**: Users can view all their log entries, listed in descending order by the date they were created.
- **Edit Log Entry**: Users can edit the details of an existing log entry.
- **Delete Log Entry**: Users can delete a log entry and its associated gallery. This action is confirmed with the user before proceeding.

### Gallery Management
- **View Galleries**: Users can view all galleries associated with their log entries. Galleries are listed in descending order by the date they were created.
- **Add Photos to Gallery**: Users can upload new photos to an existing gallery.
- **View Photos**: Users can view photos within a gallery. Clicking on a photo enlarges it in a modal view, which can be closed by clicking a close button or clicking outside the modal.
- **Delete Photos**: Users can delete individual photos from a gallery.
- **Delete Gallery**: Users can delete a gallery and its associated log entry. This action is confirmed with the user before proceeding.

### Account Management
- **View Account Details**: Users can view and update their account details, including their first name, last name, and email address.
- **Delete Account**: Users can delete their account. This action deletes all user data and is confirmed with the user before proceeding.
- **Export Data**: Users can export their logbook entries, galleries, or all data as a ZIP file.

### Search and Filter
- **Logbook Search and Filter**: Users can search and filter logbook entries based on various criteria such as aircraft type, operator, aircraft ID, flight number, date spotted, location, origin, and destination.
- **Gallery Search and Filter**: Users can search and filter galleries based on similar criteria.

### Real-time Updates
- **Real-time Logbook Updates**: Logbook entries are updated in real-time as changes are made.
- **Real-time Gallery Updates**: Galleries and their photos are updated in real-time as changes are made.

### Loading Spinner
- **Loading Spinner**: A loading spinner is displayed while photos are being uploaded, and while logbooks and galleries are being deleted to indicate processing.

## How to Use

1. **Signup/Login**: Create a new account or log in using your existing credentials.
2. **Create Log Entries**: Add new aircraft spotting entries with detailed information and photos.
3. **Manage Galleries**: View, add, or delete photos in your galleries.
4. **Search and Filter**: Utilize the search and filter functionality to find specific log entries or galleries.
5. **Export Data**: Export your logbook entries, galleries, or all data for backup or sharing purposes.
6. **Manage Account**: Update your account details or delete your account if necessary.

## Technologies Used

- **Firebase**: For authentication, Firestore for database management, and Firebase Storage for storing photos.
- **JavaScript**: For client-side logic and interaction.
- **HTML/CSS**: For structuring and styling the web application.
- **JSZip**: For exporting data as ZIP files.

## License

AeroLogger is open-source software licensed under the MIT License.
