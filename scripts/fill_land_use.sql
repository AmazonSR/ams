drop table if exists land_use;
CREATE TABLE public.land_use (
	id serial2 NOT NULL,
	"name" varchar NULL,
	priority integer NULL,
	CONSTRAINT land_use_pk PRIMARY KEY (id)
);
INSERT INTO land_use values(1,'APA',3);
INSERT INTO land_use values(2,'Assentamentos',2);
INSERT INTO land_use values(3,'CAR',4);
INSERT INTO land_use values(4,'FPND',5);
INSERT INTO land_use values(5,'TI',0);
INSERT INTO land_use values(6,'UC',1);
INSERT INTO land_use values(12,'Indefinida',6);
