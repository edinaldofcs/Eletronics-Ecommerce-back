import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: 'sk_test_51Ku42tFb5tpQxri8OBVua8v6QNNPiYwXjxzSdhgmKCv64q89V6s3rPLCMJVHIm6fR1AUw3hDki7A3vvltxlUe7Yq00q8aImgCJ',
      apiVersion: '2020-08-27',
    }),
  ],
})
export class MyStripe {}