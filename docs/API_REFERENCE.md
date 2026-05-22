# Gyanodaya API Reference

Base URL: `http://localhost:5002/api/v1`

Auth header for protected APIs:

```http
Authorization: Bearer <accessToken>
```

## API Table

| Module | Method | URL | Auth | Sample Body |
|---|---|---|---|---|
| Health | GET | `/health` | No | None |
| Auth | POST | `/auth/register` | No | `{"firstName":"Aarav","lastName":"Reddy","email":"aarav@example.com","password":"password123","gender":"male","role":"student"}` |
| Auth | POST | `/auth/login` | No | `{"email":"aarav@example.com","password":"password123"}` |
| Auth | POST | `/auth/google-signin` | No | `{"idToken":"GOOGLE_ID_TOKEN"}` |
| Auth | POST | `/auth/forgot-password` | No | `{"email":"aarav@example.com"}` |
| Auth | POST | `/auth/verify-otp` | No | `{"email":"aarav@example.com","otp":"123456"}` |
| Auth | POST | `/auth/reset-password` | No | `{"email":"aarav@example.com","newPassword":"newpassword123"}` |
| Auth | POST | `/auth/refresh-token` | No | `{"refreshToken":"{{refreshToken}}"}` |
| Auth | POST | `/auth/logout` | No | `{"refreshToken":"{{refreshToken}}"}` |
| Users | GET | `/users/profile` | Bearer | None |
| Users | PATCH | `/users/profile` | Bearer | `{"firstName":"Aarav Updated","lastName":"Reddy","gender":"male"}` |
| Users | POST | `/users/profile/image` | Bearer | `form-data: profileImage=<file>` |
| Users | GET | `/users/statistics` | Bearer | None |
| Teachers | GET | `/teachers?search=math&page=1&limit=10&sort=-createdAt` | No | None |
| Teachers | GET | `/teachers/:teacherId` | No | None |
| Teachers | GET | `/teachers/:teacherId/courses` | No | None |
| Teachers | GET | `/teachers/:teacherId/ratings` | No | None |
| Teachers | POST | `/teachers/:teacherId/follow` | Bearer | None |
| Teachers | POST | `/teachers/:teacherId/ratings` | Bearer | `{"rating":4.5}` |
| Courses | GET | `/courses?search=physics&subject=Physics&featured=true&page=1&limit=10` | No | None |
| Courses | GET | `/courses/featured` | No | None |
| Courses | GET | `/courses/recent` | No | None |
| Courses | GET | `/courses/premium` | No | None |
| Courses | GET | `/courses/:courseId` | No | None |
| Mock Tests | GET | `/mock-tests?search=JEE&category=Physics&premiumStatus=false&page=1&limit=10` | No | None |
| Mock Tests | GET | `/mock-tests/free` | No | None |
| Mock Tests | GET | `/mock-tests/premium` | No | None |
| Mock Tests | GET | `/mock-tests/categories` | No | None |
| Mock Tests | GET | `/mock-tests/:mockTestId` | No | None |
| Mock Tests | GET | `/mock-tests/:mockTestId/questions` | Bearer | None |
| Mock Tests | POST | `/mock-tests/:mockTestId/start` | Bearer | None |
| Mock Tests | PATCH | `/mock-tests/sessions/:sessionId/answer` | Bearer | `{"questionId":"QUESTION_ID","selectedOptions":[0],"timeSpent":30}` |
| Mock Tests | GET | `/mock-tests/sessions/:sessionId/timer` | Bearer | None |
| Mock Tests | GET | `/mock-tests/sessions/:sessionId/palette` | Bearer | None |
| Mock Tests | POST | `/mock-tests/sessions/:sessionId/submit` | Bearer | None |
| Results | GET | `/results/my` | Bearer | None |
| Results | GET | `/results/leaderboard/:mockTestId` | No | None |
| Admin | GET | `/admin/dashboard` | Admin Bearer | None |
| Admin | GET | `/admin/users` | Admin Bearer | None |
| Admin | PATCH | `/admin/users/:userId/status` | Admin Bearer | `{"isActive":false}` |
| Admin | GET | `/admin/teachers` | Admin Bearer | None |
| Admin | POST | `/admin/teachers` | Admin Bearer | `{"name":"Prof. V. Kumar","specialization":"Mathematics","experience":{"years":15,"summary":"JEE Advanced expert"},"studentsCount":15000,"profileImage":"https://example.com/teacher.jpg","bio":"Senior mathematics faculty"}` |
| Admin | PATCH | `/admin/teachers/:teacherId` | Admin Bearer | `{"specialization":"Physics","studentsCount":16000}` |
| Admin | GET | `/admin/courses` | Admin Bearer | None |
| Admin | POST | `/admin/courses` | Admin Bearer | `{"title":"Advanced Physics","slug":"advanced-physics","subject":"Physics","description":"Mechanics to Modern Physics","lessonsCount":120,"premiumStatus":true,"featured":true,"teacher":"TEACHER_ID","thumbnail":"https://example.com/course.jpg","tags":["jee","physics"]}` |
| Admin | PATCH | `/admin/courses/:courseId` | Admin Bearer | `{"premiumStatus":false,"featured":true}` |
| Admin | GET | `/admin/mock-tests` | Admin Bearer | None |
| Admin | POST | `/admin/mock-tests` | Admin Bearer | `{"title":"JEE Full Mock 1","subject":"Physics","duration":180,"totalQuestions":90,"difficulty":"hard","markingType":-2.5,"premiumStatus":false,"category":"JEE","featured":true,"recent":true,"instructions":["Read each question carefully","No calculator allowed"]}` |
| Admin | PATCH | `/admin/mock-tests/:mockTestId` | Admin Bearer | `{"premiumStatus":true,"recent":false}` |
| Admin | GET | `/admin/questions` | Admin Bearer | None |
| Admin | POST | `/admin/questions` | Admin Bearer | `{"mockTest":"MOCK_TEST_ID","title":"What is the SI unit of force?","type":"single_correct","subject":"Physics","topic":"Units","options":[{"text":"Newton","image":""},{"text":"Joule","image":""},{"text":"Pascal","image":""},{"text":"Watt","image":""}],"correctAnswers":[0],"explanation":"Force is measured in Newtons.","positiveMarks":4,"negativeMarks":-0.5,"order":1}` |
| Admin | PATCH | `/admin/questions/:questionId` | Admin Bearer | `{"explanation":"Updated explanation","negativeMarks":-2.5}` |

## Testing Order

1. Register
2. Login
3. Save `accessToken` and `refreshToken`
4. Get profile
5. List mock tests
6. Start a test
7. Get questions
8. Save answers
9. Submit test
10. View results

## Notes

- The old prototype files outside `src/` are not used by the running server.
- `/users/profile/image` must be sent as `form-data` in Postman.
- Admin APIs need a token from a user whose `role` is `admin`.
