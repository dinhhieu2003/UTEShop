module.exports = {
    preset: 'ts-jest',  // Sử dụng ts-jest để biên dịch TypeScript
    testEnvironment: 'node',  // Sử dụng môi trường Node.js
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',  // Chuyển đổi các tệp .ts và .tsx
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],  // Xác định các loại tệp mà Jest sẽ nhận dạng
  };