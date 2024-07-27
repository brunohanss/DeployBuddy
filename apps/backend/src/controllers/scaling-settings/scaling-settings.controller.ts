import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('scaling-settings')
export class ScalingSettingsController {
  @Post()
  async setScalingSettings(
    @Body()
    scalingSettingsDto: {
      instanceId: string;
      minInstances: number;
      maxInstances: number;
      cpuThreshold: number;
      memoryThreshold: number;
    },
  ) {
    // Logic to set scaling settings for the specified instance
    return {
      message: `Scaling settings updated for instance ${scalingSettingsDto.instanceId}`,
    };
  }

  @Get()
  async getAllScalingSettings() {
    // Retrieve and return all scaling settings
    return [
      {
        id: 1,
        instanceId: '1',
        minInstances: 1,
        maxInstances: 5,
        cpuThreshold: 70,
        memoryThreshold: 80,
      },
    ];
  }
}
