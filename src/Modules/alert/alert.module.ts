import { ShareModule } from '../share/share.module';
import { AlertService } from './alert.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [ShareModule],
  providers: [AlertService],
})
export class AlertModule {}
