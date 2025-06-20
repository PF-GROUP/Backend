import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './agency.dto';


@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post()
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agencyService.create(createAgencyDto);
  }

  
  @Get()
  findAll() {
    return this.agencyService.findAll();
  }
  @Get('getByUser/:id')
 async getByUser(@Param('id') id: string) {
    const useId = parseInt(id);
    console.log(useId)
    const agency = await this.agencyService.findOneByUserId(useId);
    console.log(agency)
    return agency
    }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agencyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgencyDto: CreateAgencyDto) {
    return this.agencyService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agencyService.remove(id);
  }
}
