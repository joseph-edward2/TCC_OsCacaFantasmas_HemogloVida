<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('estoque', function (Blueprint $table) {
            $table->id('id_estoque');
            $table->integer('quant_estoque')->unsigned();
            $table->string('tipo_estoque', 3);
            $table->enum('status_estoque', ['cheio', 'normal', 'critico', 'manutencao']);
            $table->date('data_validade_estoque');
            $table->char('cnes_hemocentro', 7);

            $table->foreign('cnes_hemocentro')
                ->references('cnes_hemocentro')->on('hemocentro')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estoque');
    }
};
