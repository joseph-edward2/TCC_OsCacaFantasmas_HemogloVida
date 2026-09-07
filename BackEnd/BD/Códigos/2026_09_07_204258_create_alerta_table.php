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
        Schema::create('alerta', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_alerta', 50);
            $table->datetime('data_hora_alerta');
            $table->smallInteger('duracao_alerta')->unsigned();
            $table->char('cnes_hemocentro', 7);
            $table->char('login_funcionario', 16);

            $table->foreign('cnes_hemocentro')
                ->references('cnes_hemocentro')->on('hemocentro')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('login_funcionario')
                ->references('login_funcionario')->on('funcionario')
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
        Schema::dropIfExists('alerta');
    }
};
